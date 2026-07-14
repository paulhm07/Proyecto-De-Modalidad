package com.educaplay.syllablehunter

import android.animation.AnimatorSet
import android.animation.ObjectAnimator
import android.content.Context
import android.graphics.Color
import android.graphics.Typeface
import android.media.AudioManager
import android.media.ToneGenerator
import android.os.Build
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager
import android.util.Log
import android.view.Gravity
import android.view.MotionEvent
import android.view.View
import android.view.ViewGroup
import android.view.animation.AccelerateInterpolator
import android.view.animation.DecelerateInterpolator
import android.widget.FrameLayout
import android.widget.ImageView
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import kotlin.random.Random

/**
 * SyllableHunterActivity.kt
 * Minijuego "Cazador de Sílabas" - Lengua para 3er grado
 *
 * Mecánica:
 * - En la parte superior se muestra una palabra objetivo separada en sílabas
 *   (ej: "PLA-TA-NO" resaltando la sílaba tónica PLA)
 * - Globos con sílabas suben verticalmente desde la parte inferior de la pantalla
 * - El niño debe tocar (reventar) los globos en el ORDEN CORRECTO
 *   para formar la palabra objetivo
 * - Si toca una sílaba incorrecta, pierde una vida y vibra
 * - Si completa la palabra, gana puntos y pasa a la siguiente
 *
 * Recursos:
 * - Sonidos: ToneGenerator nativo (NO requiere MP3)
 * - Imágenes: balloon_red/blue/green.png en res/drawable
 * - Animación de explosión: generada por código (scale + alpha)
 *
 * @author EducaPlay
 */
class SyllableHunterActivity : AppCompatActivity() {

    // ===== Vistas =====
    private lateinit var gameArea: FrameLayout          // área donde suben los globos
    private lateinit var tvTargetWord: TextView          // palabra objetivo (arriba)
    private lateinit var tvProgress: TextView            // progreso del niño (sílabas correctas)
    private lateinit var tvScore: TextView
    private lateinit var tvLives: TextView
    private lateinit var tvRound: TextView

    // ===== Estado del juego =====
    private var score = 0
    private var lives = 3
    private var round = 1
    private val maxRounds = 8

    // Palabra actual que se debe formar
    private lateinit var currentWord: String                    // palabra completa (ej: "PLATANO")
    private lateinit var currentSyllables: List<String>         // sílabas (ej: ["PLA", "TA", "NO"])
    private var currentSyllableIndex = 0                        // próxima sílaba esperada

    // ===== Banco de palabras con sílabas separadas =====
    // Cada entrada: palabra completa + lista de sílabas (la tónica marcada con acento)
    private val wordBank = listOf(
        WordEntry("PLÁTANO", listOf("PLÁ", "TA", "NO")),
        WordEntry("MARIPOSA", listOf("MA", "RI", "PO", "SA")),
        WordEntry("ELEFANTE", listOf("E", "LE", "FAN", "TE")),
        WordEntry("JIRAFA", listOf("JI", "RA", "FA")),
        WordEntry("TORTUGA", listOf("TOR", "TU", "GA")),
        WordEntry("MARIANA", listOf("MA", "RI", "A", "NA")),
        WordEntry("CHOCOLATE", listOf("CHO", "CO", "LA", "TE")),
        WordEntry("PELOTA", listOf("PE", "LO", "TA")),
        WordEntry("GUITARRA", listOf("GUI", "TA", "RRA")),
        WordEntry("VENTANA", listOf("VEN", "TA", "NA")),
        WordEntry("CAMINO", listOf("CA", "MI", "NO")),
        WordEntry("DINOSAURIO", listOf("DI", "NO", "SAU", "RIO"))
    )

    // ===== Globos activos en pantalla =====
    private val activeBalloons = mutableListOf<BalloonView>()

    // ===== Loop de animación =====
    private val handler = Handler(Looper.getMainLooper())
    private var spawnRunnable: Runnable? = null
    private var moveRunnable: Runnable? = null
    private var gameRunning = false

    // Velocidades (px por frame)
    private val minSpeed = 3f
    private val maxSpeed = 6f

    // ===== Audio y vibración =====
    private var toneGenerator: ToneGenerator? = null
    private lateinit var vibrator: Vibrator

    companion object {
        private const val TAG = "SyllableHunter"
        private const val BALLOON_SIZE_DP = 110
        private const val SPAWN_INTERVAL_MS = 1500L   // nuevo globo cada 1.5s
        private const val MOVE_INTERVAL_MS = 30L      // 30ms ≈ 33 FPS
    }

    /**
     * Clase de datos: palabra con sus sílabas.
     */
    data class WordEntry(val word: String, val syllables: List<String>)

    /**
     * Vista personalizada de un globo: ImageView con texto encima.
     */
    data class BalloonView(
        val container: FrameLayout,   // contenedor con imagen + texto
        val syllable: String,         // sílaba escrita en el globo
        var y: Float,                 // posición Y actual
        val speed: Float,             // velocidad de subida
        val color: Int                // color del globo (para variar)
    )

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_syllable_hunter)

        initViews()
        initAudio()
        initVibrator()
        startNewRound()
    }

    private fun initViews() {
        gameArea = findViewById(R.id.gameArea)
        tvTargetWord = findViewById(R.id.tvTargetWord)
        tvProgress = findViewById(R.id.tvProgress)
        tvScore = findViewById(R.id.tvScore)
        tvLives = findViewById(R.id.tvLives)
        tvRound = findViewById(R.id.tvRound)
    }

    private fun initAudio() {
        try {
            toneGenerator = ToneGenerator(AudioManager.STREAM_MUSIC, 80)
        } catch (e: Exception) {
            Log.e(TAG, "ToneGenerator init error: ${e.message}")
        }
    }

    private fun initVibrator() {
        vibrator = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            (getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as VibratorManager).defaultVibrator
        } else {
            @Suppress("DEPRECATION")
            getSystemService(Context.VIBRATOR_SERVICE) as Vibrator
        }
    }

    // ============================================================
    // 1) LÓGICA DE GENERACIÓN Y MOVIMIENTO INFINITO DE GLOBOS
    // ============================================================

    /**
     * Inicia el loop de generación de globos.
     * Cada SPAWN_INTERVAL_MS crea un nuevo globo en la parte inferior.
     */
    private fun startSpawningBalloons() {
        gameRunning = true
        spawnRunnable = object : Runnable {
            override fun run() {
                if (!gameRunning) return
                spawnBalloon()
                handler.postDelayed(this, SPAWN_INTERVAL_MS)
            }
        }
        handler.post(spawnRunnable!!)

        // Loop de movimiento (mueve todos los globos hacia arriba)
        moveRunnable = object : Runnable {
            override fun run() {
                if (!gameRunning) return
                moveBalloons()
                handler.postDelayed(this, MOVE_INTERVAL_MS)
            }
        }
        handler.post(moveRunnable!!)
    }

    /**
     * Detiene el loop de globos.
     */
    private fun stopSpawningBalloons() {
        gameRunning = false
        spawnRunnable?.let { handler.removeCallbacks(it) }
        moveRunnable?.let { handler.removeCallbacks(it) }
    }

    /**
     * Crea un nuevo globo con una sílaba escrita.
     * - Posición X aleatoria
     * - Sílaba: puede ser la correcta (siguiente esperada) o un distractor
     * - Velocidad aleatoria apta para niños (3-6 px/frame)
     */
    private fun spawnBalloon() {
        if (gameArea.width == 0) return  // layout aún no medido

        val density = resources.displayMetrics.density
        val balloonSizePx = (BALLOON_SIZE_DP * density).toInt()

        // Decidir qué sílaba poner en el globo:
        // 50% probabilidad: la próxima sílaba correcta
        // 50% probabilidad: un distractor aleatorio
        val syllable: String = if (Random.nextFloat() < 0.5f && currentSyllableIndex < currentSyllables.size) {
            currentSyllables[currentSyllableIndex]
        } else {
            // Distractor: sílaba de otra palabra del banco
            val randomWord = wordBank.random()
            randomWord.syllables.random()
        }

        // Color aleatorio del globo
        val colorRes = when (Random.nextInt(3)) {
            0 -> R.drawable.balloon_red
            1 -> R.drawable.balloon_blue
            else -> R.drawable.balloon_green
        }

        // Posición X aleatoria dentro del área de juego
        val maxX = gameArea.width - balloonSizePx
        val startX = if (maxX > 0) Random.nextInt(0, maxX).toFloat() else 0f

        // Posición Y inicial: justo debajo del área visible
        val startY = gameArea.height.toFloat()

        // Velocidad aleatoria apta para niños (no muy rápida)
        val speed = Random.nextFloat() * (maxSpeed - minSpeed) + minSpeed

        // Crear contenedor FrameLayout (globo + texto)
        val container = FrameLayout(this).apply {
            layoutParams = FrameLayout.LayoutParams(balloonSizePx, balloonSizePx)
            x = startX
            y = startY
        }

        // Imagen del globo
        val imageView = ImageView(this).apply {
            layoutParams = FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
            )
            setImageResource(colorRes)
            scaleType = ImageView.ScaleType.FIT_CENTER
        }

        // Texto de la sílaba encima del globo
        val textView = TextView(this).apply {
            layoutParams = FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
            )
            text = syllable
            setTextColor(Color.WHITE)
            textSize = 22f
            setTypeface(typeface, Typeface.BOLD)
            gravity = Gravity.CENTER
            // Sombra del texto para que se lea sobre el globo
            setShadowLayer(4f, 2f, 2f, Color.BLACK)
        }

        container.addView(imageView)
        container.addView(textView)

        // Listener de toque para reventar el globo
        container.setOnTouchListener { view, event ->
            if (event.action == MotionEvent.ACTION_DOWN) {
                popBalloon(view, syllable)
                true
            } else false
        }

        // Agregar al área de juego y a la lista de globos activos
        gameArea.addView(container)
        val balloon = BalloonView(container, syllable, startY, speed, colorRes)
        activeBalloons.add(balloon)
    }

    /**
     * Mueve todos los globos hacia arriba.
     * Si un globo sale de la pantalla por arriba, se elimina.
     */
    private fun moveBalloons() {
        val iterator = activeBalloons.iterator()
        while (iterator.hasNext()) {
            val balloon = iterator.next()
            balloon.y -= balloon.speed
            balloon.container.y = balloon.y

            // Si el globo salió completamente por arriba, eliminarlo
            val balloonHeight = balloon.container.height
            if (balloon.y + balloonHeight < 0) {
                gameArea.removeView(balloon.container)
                iterator.remove()
            }
        }
    }

    // ============================================================
    // 2) DETECTOR DE TOQUES Y EFECTO VISUAL DE EXPLOSIÓN
    // ============================================================

    /**
     * Reventa un globo cuando el niño lo toca.
     * - Ejecuta animación de explosión (scale up + fade out)
     * - Reproduce sonido de "pop"
     * - Valida si la sílaba era la correcta
     */
    private fun popBalloon(view: View, syllable: String) {
        // Buscar el globo en la lista
        val balloon = activeBalloons.find { it.container === view } ?: return

        // Reproducir sonido "pop" (tono agudo corto)
        playPopSound()

        // Animación de explosión: scale up + fade out + rotación
        animateExplosion(view) {
            // Al terminar la animación, eliminar el globo
            gameArea.removeView(view)
            activeBalloons.remove(balloon)

            // Validar la sílaba
            validateSyllable(syllable)
        }
    }

    /**
     * Animación de explosión del globo:
     * - Scale up 1 → 1.8 (se expande)
     * - Alpha 1 → 0 (se desvanece)
     * - Rotación leve (efecto cómico)
     * Duración: 250ms
     */
    private fun animateExplosion(view: View, onEnd: () -> Unit) {
        val scaleX = ObjectAnimator.ofFloat(view, "scaleX", 1f, 1.8f)
        val scaleY = ObjectAnimator.ofFloat(view, "scaleY", 1f, 1.8f)
        val alpha = ObjectAnimator.ofFloat(view, "alpha", 1f, 0f)
        val rotation = ObjectAnimator.ofFloat(view, "rotation", 0f, 30f)

        val animatorSet = AnimatorSet()
        animatorSet.playTogether(scaleX, scaleY, alpha, rotation)
        animatorSet.duration = 250
        animatorSet.interpolator = AccelerateInterpolator()
        animatorSet.addListener(object : android.animation.AnimatorListenerAdapter() {
            override fun onAnimationEnd(animation: android.animation.Animator) {
                onEnd()
            }
        })
        animatorSet.start()
    }

    // ============================================================
    // 3) SISTEMA DE PUNTUACIÓN Y CONTROL DE ERRORES
    // ============================================================

    /**
     * Valida si la sílaba reventada es la próxima esperada.
     */
    private fun validateSyllable(syllable: String) {
        if (currentSyllableIndex >= currentSyllables.size) return

        val expectedSyllable = currentSyllables[currentSyllableIndex]

        if (syllable == expectedSyllable) {
            // ===== ACIERTO =====
            onCorrectSyllable()
        } else {
            // ===== ERROR =====
            onWrongSyllable()
        }
    }

    /**
     * Sílaba correcta en el orden correcto:
     * - Suma puntos
     * - Actualiza el progreso
     * - Si completó la palabra, pasa a la siguiente ronda
     */
    private fun onCorrectSyllable() {
        score += 10
        currentSyllableIndex++

        tvScore.text = "⭐ $score"

        // Actualizar el progreso visual
        updateProgressDisplay()

        // Sonido de acierto (tono ascendente)
        playSuccessTone()

        // Verificar si completó la palabra
        if (currentSyllableIndex >= currentSyllables.size) {
            // ¡Palabra completada!
            score += 20  // bonus por completar
            tvScore.text = "⭐ $score"

            handler.postDelayed({
                round++
                if (round > maxRounds) {
                    endGame()
                } else {
                    startNewRound()
                }
            }, 800)
        }
    }

    /**
     * Sílaba incorrecta:
     * - Pierde una vida
     * - Vibra el dispositivo
     * - Sonido de error
     * - Reinicia el progreso de la palabra actual
     */
    private fun onWrongSyllable() {
        lives--
        tvLives.text = "❤️".repeat(lives) + "🖤".repeat(3 - lives)

        // Vibración de error
        vibrateError()

        // Sonido de error (tono grave)
        playFailTone()

        // Sacudir la palabra objetivo (feedback visual de error)
        shakeTargetWord()

        // Reiniciar el progreso de la palabra actual (debe empezar de nuevo)
        currentSyllableIndex = 0
        updateProgressDisplay()

        Toast.makeText(this, "¡Sílaba incorrecta! Empieza de nuevo 😊", Toast.LENGTH_SHORT).show()

        if (lives <= 0) {
            handler.postDelayed({ endGame() }, 1000)
        }
    }

    /**
     * Actualiza la visualización del progreso.
     * Muestra las sílabas ya completadas en verde y las pendientes en gris.
     */
    private fun updateProgressDisplay() {
        val progress = StringBuilder()
        for (i in currentSyllables.indices) {
            if (i < currentSyllableIndex) {
                progress.append("✓${currentSyllables[i]}")
            } else {
                progress.append("___")
            }
            if (i < currentSyllables.size - 1) progress.append(" - ")
        }
        tvProgress.text = progress.toString()
    }

    /**
     * Inicia una nueva ronda con una palabra aleatoria del banco.
     */
    private fun startNewRound() {
        // Limpiar globos existentes
        clearAllBalloons()

        // Seleccionar palabra aleatoria
        val wordEntry = wordBank[Random.nextInt(wordBank.size)]
        currentWord = wordEntry.word
        currentSyllables = wordEntry.syllables
        currentSyllableIndex = 0

        // Mostrar palabra objetivo
        tvTargetWord.text = currentSyllables.joinToString(" - ")
        tvRound.text = "Ronda: $round/$maxRounds"
        updateProgressDisplay()

        // Iniciar spawn de globos
        startSpawningBalloons()
    }

    /**
     * Elimina todos los globos de la pantalla.
     */
    private fun clearAllBalloons() {
        stopSpawningBalloons()
        for (balloon in activeBalloons) {
            gameArea.removeView(balloon.container)
        }
        activeBalloons.clear()
    }

    /**
     * Anima la palabra objetivo sacudiéndose (feedback de error).
     */
    private fun shakeTargetWord() {
        val shake = ObjectAnimator.ofFloat(
            tvTargetWord, "translationX",
            0f, -15f, 15f, -15f, 15f, 0f
        )
        shake.duration = 400
        shake.interpolator = DecelerateInterpolator()
        shake.start()

        // Tinte rojo temporal
        tvTargetWord.setTextColor(Color.parseColor("#DC2626"))
        handler.postDelayed({
            tvTargetWord.setTextColor(Color.parseColor("#7C3AED"))
        }, 400)
    }

    /**
     * Termina el juego y muestra el resultado.
     */
    private fun endGame() {
        clearAllBalloons()

        // Tono de victoria
        toneGenerator?.startTone(ToneGenerator.TONE_CDMA_ALERT_AUTOREDIAL_LITE, 500)

        val message = when {
            score >= 80 -> "¡Excelente! Eres un cazador de sílabas 🏆"
            score >= 50 -> "¡Muy bien! Formaste muchas palabras 🎉"
            else -> "¡Sigue practicando! Los globos te esperan 💪"
        }

        Toast.makeText(this, "$message\nPuntuación: $score", Toast.LENGTH_LONG).show()

        // Reiniciar tras 3s
        handler.postDelayed({
            score = 0
            lives = 3
            round = 1
            tvScore.text = "⭐ 0"
            tvLives.text = "❤️❤️❤️"
            startNewRound()
        }, 3000)
    }

    // ============================================================
    // SONIDOS (ToneGenerator - sin MP3)
    // ============================================================

    /**
     * Sonido "pop" del globo reventado: tono agudo corto.
     */
    private fun playPopSound() {
        toneGenerator?.startTone(ToneGenerator.TONE_PROP_BEEP, 80)
    }

    /**
     * Sonido de acierto: tono ascendente.
     */
    private fun playSuccessTone() {
        toneGenerator?.startTone(ToneGenerator.TONE_PROP_BEEP, 100)
        handler.postDelayed({
            toneGenerator?.startTone(ToneGenerator.TONE_PROP_BEEP2, 120)
        }, 120)
    }

    /**
     * Sonido de error: tono grave.
     */
    private fun playFailTone() {
        toneGenerator?.startTone(ToneGenerator.TONE_PROP_BEEP_LOW, 300)
    }

    /**
     * Vibración de error: 3 vibraciones cortas.
     */
    private fun vibrateError() {
        if (!vibrator.hasVibrator()) return
        val pattern = longArrayOf(0, 200, 100, 200, 100, 200)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            vibrator.vibrate(VibrationEffect.createWaveform(pattern, -1))
        } else {
            @Suppress("DEPRECATION")
            vibrator.vibrate(pattern, -1)
        }
    }

    override fun onPause() {
        super.onPause()
        stopSpawningBalloons()
    }

    override fun onResume() {
        super.onResume()
        if (!gameRunning && ::currentWord.isInitialized) {
            startSpawningBalloons()
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        stopSpawningBalloons()
        toneGenerator?.release()
        toneGenerator = null
    }
}

package com.educaplay.monstermath

import android.animation.AnimatorSet
import android.animation.ObjectAnimator
import android.content.Context
import android.graphics.Color
import android.media.AudioManager
import android.media.SoundPool
import android.os.Build
import android.os.Bundle
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager
import android.util.Log
import android.view.DragEvent
import android.view.MotionEvent
import android.view.View
import android.view.animation.AccelerateInterpolator
import android.view.animation.DecelerateInterpolator
import android.widget.Button
import android.widget.FrameLayout
import android.widget.ImageView
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import kotlin.random.Random

/**
 * FeedMonsterActivity.kt
 * Minijuego "Alimenta al Monstruo" - Matemáticas 3er grado
 *
 * Mecánica:
 * - Se muestra una división o multiplicación (ej: 24 ÷ 3 = ?)
 * - El monstruo está en la parte superior con la boca abierta (DROP TARGET)
 * - 3 botones con números están abajo (DRAG SOURCE)
 * - El niño arrastra la respuesta correcta hacia el monstruo
 *
 * Validación:
 * - Acierto: sonido de "comer" + animación de masticar + aumenta score
 * - Fallo: vibración + animación de sacudida + pierde una vida
 *
 * @author EducaPlay
 */
class FeedMonsterActivity : AppCompatActivity() {

    // ===== Vistas =====
    private lateinit var tvScore: TextView
    private lateinit var tvRound: TextView
    private lateinit var tvLives: TextView
    private lateinit var tvQuestion: TextView
    private lateinit var tvMonsterSpeech: TextView
    private lateinit var tvFeedback: TextView
    private lateinit var ivMonster: ImageView
    private lateinit var dragTargetMonster: FrameLayout
    private lateinit var btnAnswer1: Button
    private lateinit var btnAnswer2: Button
    private lateinit var btnAnswer3: Button

    // ===== Estado del juego =====
    private var currentAnswer = 0
    private var score = 0
    private var round = 1
    private val maxRounds = 10
    private var lives = 3
    private val answerButtons: MutableList<Button> = mutableListOf()

    // ===== Audio y vibración =====
    private lateinit var soundPool: SoundPool
    private var soundEat = 0      // sonido de comer (éxito)
    private var soundFail = 0     // sonido de error (fallo)
    private var soundWin = 0      // sonido de victoria final
    private lateinit var vibrator: Vibrator

    // ===== Tag para drag =====
    companion object {
        private const val TAG = "FeedMonster"
        private const val DRAG_TAG = "ANSWER_DRAG"
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_feed_monster)

        initViews()
        initAudio()
        initVibrator()
        setupDragListeners()
        newRound()
    }

    /**
     * Inicializa todas las vistas del layout.
     */
    private fun initViews() {
        tvScore = findViewById(R.id.tvScore)
        tvRound = findViewById(R.id.tvRound)
        tvLives = findViewById(R.id.tvLives)
        tvQuestion = findViewById(R.id.tvQuestion)
        tvMonsterSpeech = findViewById(R.id.tvMonsterSpeech)
        tvFeedback = findViewById(R.id.tvFeedback)
        ivMonster = findViewById(R.id.ivMonster)
        dragTargetMonster = findViewById(R.id.dragTargetMonster)
        btnAnswer1 = findViewById(R.id.btnAnswer1)
        btnAnswer2 = findViewById(R.id.btnAnswer2)
        btnAnswer3 = findViewById(R.id.btnAnswer3)

        answerButtons.apply {
            add(btnAnswer1)
            add(btnAnswer2)
            add(btnAnswer3)
        }

        // El monstruo no es clickeable, solo recibe drops
        ivMonster.isClickable = false
    }

    /**
     * Inicializa SoundPool para efectos de sonido cortos.
     * Usa el AudioManager para sincronizar con el volumen del sistema.
     */
    private fun initAudio() {
        soundPool = SoundPool.Builder()
            .setMaxStreams(4)
            .setAudioAttributes(
                android.media.AudioAttributes.Builder()
                    .setUsage(android.media.AudioAttributes.USAGE_GAME)
                    .setContentType(android.media.AudioAttributes.CONTENT_TYPE_SONIFICATION)
                    .build()
            )
            .build()

        // Cargar sonidos desde res/raw/
        // Archivos: eat_sound.mp3, fail_sound.mp3, win_sound.mp3
        soundEat = soundPool.load(this, R.raw.eat_sound, 1)
        soundFail = soundPool.load(this, R.raw.fail_sound, 1)
        soundWin = soundPool.load(this, R.raw.win_sound, 1)
    }

    /**
     * Inicializa el Vibrador (compatible con API 21+ y API 26+).
     */
    private fun initVibrator() {
        vibrator = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            val vibratorManager = getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as VibratorManager
            vibratorManager.defaultVibrator
        } else {
            @Suppress("DEPRECATION")
            getSystemService(Context.VIBRATOR_SERVICE) as Vibrator
        }
    }

    /**
     * Configura los listeners de arrastre (touch) y soltado (drag).
     *
     * - OnTouchListener: en cada botón de respuesta (detecta el inicio del arrastre)
     * - OnDragListener: en el contenedor del monstruo (detecta el soltado)
     */
    private fun setupDragListeners() {
        // Cada botón de respuesta es arrastrable
        for (btn in answerButtons) {
            btn.setOnTouchListener { view, event ->
                when (event.action) {
                    MotionEvent.ACTION_DOWN -> {
                        // Crear la sombra de arrastre (visual del botón moviéndose)
                        val shadow = View.DragShadowBuilder(view)
                        // Pasar el valor del botón como estado local del drag
                        val value = (view as Button).text.toString().toInt()
                        val clipText = value.toString()
                        val mime = arrayOf("text/plain")
                        val item = android.content.ClipData.Item(clipText)
                        val clipData = android.content.ClipData(DRAG_TAG, mime, item)

                        // Iniciar el arrastre (API 24+: usa startDragAndDrop)
                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                            view.startDragAndDrop(clipData, shadow, view, 0)
                        } else {
                            @Suppress("DEPRECATION")
                            view.startDrag(clipData, shadow, view, 0)
                        }

                        // Feedback visual: el botón se atenúa mientras se arrastra
                        view.alpha = 0.4f
                        true
                    }
                    MotionEvent.ACTION_UP, MotionEvent.ACTION_CANCEL -> {
                        view.alpha = 1f
                        true
                    }
                    else -> false
                }
            }
        }

        // El contenedor del monstruo recibe el drop
        dragTargetMonster.setOnDragListener { view, dragEvent ->
            when (dragEvent.action) {
                DragEvent.ACTION_DRAG_STARTED -> {
                    // Mostrar que el monstruo está listo para recibir
                    tvMonsterSpeech.text = "¡Dame la respuesta! 😋"
                    ivMonster.setBackgroundResource(R.drawable.monster_highlight)
                    true
                }
                DragEvent.ACTION_DRAG_ENTERED -> {
                    // El dedo entró en la zona del monstruo
                    tvMonsterSpeech.text = "¡Aquí, aquí! 👄"
                    ivMonster.scaleX = 1.15f
                    ivMonster.scaleY = 1.15f
                    true
                }
                DragEvent.ACTION_DRAG_EXITED -> {
                    // El dedo salió de la zona
                    tvMonsterSpeech.text = "¡Dame la respuesta! 😋"
                    ivMonster.scaleX = 1f
                    ivMonster.scaleY = 1f
                    true
                }
                DragEvent.ACTION_DROP -> {
                    // ===== VALIDACIÓN MATEMÁTICA =====
                    // Obtener el valor arrastrado desde el ClipData
                    val draggedText = dragEvent.clipData.getItemAt(0).text.toString()
                    val draggedValue = draggedText.toIntOrNull() ?: return@setOnDragListener false

                    // Restaurar el botón original
                    val sourceView = dragEvent.localState as? Button
                    sourceView?.alpha = 1f

                    validateAnswer(draggedValue)
                    true
                }
                DragEvent.ACTION_DRAG_ENDED -> {
                    // Restaurar estado visual del monstruo
                    ivMonster.scaleX = 1f
                    ivMonster.scaleY = 1f
                    ivMonster.setBackgroundResource(0)
                    // Restaurar opacidad del botón por si acaso
                    for (btn in answerButtons) btn.alpha = 1f
                    true
                }
                else -> false
            }
        }
    }

    /**
     * Genera una nueva ronda con una multiplicación o división de 3er grado.
     * Nivel adecuado:
     * - Multiplicación: tablas del 1 al 10 (ej: 6 × 7 = ?)
     * - División: resultado entre 1 y 10 (ej: 24 ÷ 3 = 8)
     */
    private fun newRound() {
        if (round > maxRounds || lives <= 0) {
            endGame()
            return
        }

        tvRound.text = "Ronda: $round/$maxRounds"
        tvFeedback.text = ""

        val isMultiplication = Random.nextBoolean()

        val (question, answer) = if (isMultiplication) {
            // Multiplicación: a × b, con a y b entre 1 y 10
            val a = Random.nextInt(1, 11)
            val b = Random.nextInt(1, 11)
            "$a × $b = ?" to (a * b)
        } else {
            // División: (a*b) ÷ b = a, con a y b entre 1 y 10
            // Garantiza división exacta
            val a = Random.nextInt(1, 11)
            val b = Random.nextInt(1, 11)
            val dividend = a * b
            "$dividend ÷ $b = ?" to a
        }

        currentAnswer = answer
        tvQuestion.text = question
        tvMonsterSpeech.text = "¡Tengo hambre! 🤤"

        // Generar 2 distractores plausibles (cercanos al resultado)
        val options = mutableSetOf(answer)
        while (options.size < 3) {
            val offset = Random.nextInt(-3, 4) // -3..3
            val distractor = answer + offset
            if (distractor > 0 && distractor != answer) {
                options.add(distractor)
            }
        }

        // Barajar y asignar a los botones
        val shuffled = options.shuffled()
        for (i in answerButtons.indices) {
            answerButtons[i].text = shuffled[i].toString()
            answerButtons[i].visibility = View.VISIBLE
        }
    }

    /**
     * Valida si la respuesta arrastrada es correcta.
     * Ejecuta efectos de éxito o fallo según corresponda.
     */
    private fun validateAnswer(draggedValue: Int) {
        if (draggedValue == currentAnswer) {
            onCorrectAnswer()
        } else {
            onWrongAnswer()
        }
    }

    /**
     * Respuesta correcta:
     * - Reproduce sonido de comer
     * - Anima al monstruo masticando (scale up/down)
     * - Cambia la imagen del monstruo a "feliz"
     * - Aumenta la puntuación
     * - Pasa a la siguiente ronda tras 1 segundo
     */
    private fun onCorrectAnswer() {
        score += 10
        round++
        tvScore.text = "⭐ $score"
        tvFeedback.text = "¡Correcto! El monstruo está feliz 😋"
        tvFeedback.setTextColor(Color.parseColor("#16A34A"))

        // Sonido de comer
        playSound(soundEat)

        // Animación de masticar (scale up then down, repetido)
        animateMonsterEat()

        // Cambiar mensaje del monstruo
        tvMonsterSpeech.text = "¡Ñam ñam! 😋"

        // Esperar 1.2s para que termine la animación y pasar a la siguiente ronda
        dragTargetMonster.postDelayed({
            if (round <= maxRounds && lives > 0) {
                newRound()
            } else {
                endGame()
            }
        }, 1200)
    }

    /**
     * Respuesta incorrecta:
     * - Vibra el dispositivo (feedback háptico)
     * - Reproduce sonido de error
     * - Anima al monstruo sacudiéndose (shake)
     * - Resta una vida
     * - Permite reintentar (no avanza de ronda)
     */
    private fun onWrongAnswer() {
        lives--
        tvLives.text = "❤️".repeat(lives) + "🖤".repeat(3 - lives)
        tvFeedback.text = "¡Ups! Esa no era. Intenta de nuevo 😖"
        tvFeedback.setTextColor(Color.parseColor("#DC2626"))

        // Vibración (patrón de error: 3 vibraciones cortas)
        vibrateError()

        // Sonido de fallo
        playSound(soundFail)

        // Animación de sacudida del monstruo
        animateMonsterShake()

        // Cambiar mensaje del monstruo
        tvMonsterSpeech.text = "¡Esa no me gusta! 😤"

        // Si se quedó sin vidas, terminar el juego
        if (lives <= 0) {
            dragTargetMonster.postDelayed({ endGame() }, 1500)
        }
        // Si no, el niño puede intentar de nuevo con otra respuesta
    }

    /**
     * Anima al monstruo "masticando" la respuesta correcta.
     * Secuencia: scale 1 → 1.3 → 0.9 → 1.1 → 1 con interpolación.
     */
    private fun animateMonsterEat() {
        val scaleUpX = ObjectAnimator.ofFloat(ivMonster, "scaleX", 1f, 1.3f)
        val scaleUpY = ObjectAnimator.ofFloat(ivMonster, "scaleY", 1f, 1.3f)
        val scaleDownX = ObjectAnimator.ofFloat(ivMonster, "scaleX", 1.3f, 0.9f)
        val scaleDownY = ObjectAnimator.ofFloat(ivMonster, "scaleY", 1.3f, 0.9f)
        val scaleBackX = ObjectAnimator.ofFloat(ivMonster, "scaleX", 0.9f, 1f)
        val scaleBackY = ObjectAnimator.ofFloat(ivMonster, "scaleY", 0.9f, 1f)

        val animatorSet = AnimatorSet()
        animatorSet.playTogether(scaleUpX, scaleUpY)
        animatorSet.play(scaleDownX).with(scaleDownY).after(scaleUpX)
        animatorSet.play(scaleBackX).with(scaleBackY).after(scaleDownX)

        animatorSet.duration = 250
        animatorSet.interpolator = AccelerateInterpolator()
        animatorSet.start()
    }

    /**
     * Anima al monstruo sacudiéndose horizontalmente (efecto "no, no, no").
     * Usa translación X de -15 a +15 repetida 3 veces.
     */
    private fun animateMonsterShake() {
        val shake = ObjectAnimator.ofFloat(
            ivMonster, "translationX",
            0f, -25f, 25f, -25f, 25f, -15f, 15f, 0f
        )
        shake.duration = 500
        shake.interpolator = DecelerateInterpolator()
        shake.start()

        // También un leve tint rojo (opcional)
        ivMonster.setColorFilter(Color.parseColor("#66FF0000"))
        dragTargetMonster.postDelayed({
            ivMonster.clearColorFilter()
        }, 500)
    }

    /**
     * Reproduce un sonido corto con SoundPool.
     */
    private fun playSound(soundId: Int) {
        try {
            soundPool.play(soundId, 1f, 1f, 1, 0, 1f)
        } catch (e: Exception) {
            Log.e(TAG, "Error reproduciendo sonido: ${e.message}")
        }
    }

    /**
     * Vibración de error: patrón de 3 vibraciones cortas (200ms, pausa 100ms).
     * Compatible con API 26+ (VibrationEffect) y versiones anteriores.
     */
    private fun vibrateError() {
        if (!vibrator.hasVibrator()) return

        val pattern = longArrayOf(0, 200, 100, 200, 100, 200)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val effect = VibrationEffect.createWaveform(pattern, -1)
            vibrator.vibrate(effect)
        } else {
            @Suppress("DEPRECATION")
            vibrator.vibrate(pattern, -1)
        }
    }

    /**
     * Termina el juego y muestra el resultado final.
     */
    private fun endGame() {
        playSound(soundWin)

        val message = when {
            score >= 80 -> "¡Excelente! Eres un genio de las matemáticas 🏆"
            score >= 50 -> "¡Muy bien! El monstruo quedó satisfecho 🎉"
            else -> "¡Sigue practicando! El monstruo tendrá más hambre otra vez 💪"
        }

        Toast.makeText(this, "$message\nPuntuación final: $score", Toast.LENGTH_LONG).show()

        // Reiniciar el juego tras 3 segundos
        dragTargetMonster.postDelayed({
            score = 0
            round = 1
            lives = 3
            tvScore.text = "⭐ 0"
            tvLives.text = "❤️❤️❤️"
            newRound()
        }, 3000)
    }

    override fun onDestroy() {
        super.onDestroy()
        soundPool.release()
    }
}

package com.educaplay.monstermath

import android.animation.AnimatorSet
import android.animation.ObjectAnimator
import android.content.Context
import android.graphics.Color
import android.media.AudioManager
import android.media.ToneGenerator
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
 * - Acierto: tono ascendente (DO-MI-SOL) + animación de masticar + aumenta score
 * - Fallo: vibración + tono grave + animación de sacudida + pierde una vida
 *
 * IMPORTANTE: Este código NO requiere archivos MP3 externos.
 * Usa ToneGenerator nativo de Android para generar los sonidos.
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
    // ToneGenerator genera tonos DTMF nativos, NO requiere archivos MP3
    private var toneGenerator: ToneGenerator? = null
    private lateinit var vibrator: Vibrator

    companion object {
        private const val TAG = "FeedMonster"
        private const val DRAG_TAG = "ANSWER_DRAG"

        // Tonos DTMF de Android (ToneGenerator.TONE_*)
        // Tono de éxito: secuencia ascendente C-E-G (DO-MI-SOL)
        private const val TONE_SUCCESS_1 = ToneGenerator.TONE_CDMA_ALERT_CALL_GUARD
        private const val TONE_SUCCESS_2 = ToneGenerator.TONE_CDMA_ALERT_NETWORK_LITE
        private const val TONE_SUCCESS_3 = ToneGenerator.TONE_PROP_BEEP

        // Tono de fallo: beep grave
        private const val TONE_FAIL = ToneGenerator.TONE_PROP_BEEP_LOW

        // Tono de victoria final
        private const val TONE_WIN = ToneGenerator.TONE_CDMA_ALERT_AUTOREDIAL_LITE
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

        ivMonster.isClickable = false
    }

    /**
     * Inicializa el ToneGenerator para reproducir tonos nativos de Android.
     * NO requiere archivos MP3 externos — usa el sistema DTMF del dispositivo.
     *
     * Volúmen: 80 (máximo 100)
     * Stream: STREAM_MUSIC (botón de volumen de multimedia lo controla)
     */
    private fun initAudio() {
        try {
            toneGenerator = ToneGenerator(AudioManager.STREAM_MUSIC, 80)
        } catch (e: Exception) {
            Log.e(TAG, "No se pudo inicializar ToneGenerator: ${e.message}")
        }
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
     */
    private fun setupDragListeners() {
        for (btn in answerButtons) {
            btn.setOnTouchListener { view, event ->
                when (event.action) {
                    MotionEvent.ACTION_DOWN -> {
                        val shadow = View.DragShadowBuilder(view)
                        val value = (view as Button).text.toString().toInt()
                        val clipText = value.toString()
                        val mime = arrayOf("text/plain")
                        val item = android.content.ClipData.Item(clipText)
                        val clipData = android.content.ClipData(DRAG_TAG, mime, item)

                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                            view.startDragAndDrop(clipData, shadow, view, 0)
                        } else {
                            @Suppress("DEPRECATION")
                            view.startDrag(clipData, shadow, view, 0)
                        }

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

        dragTargetMonster.setOnDragListener { view, dragEvent ->
            when (dragEvent.action) {
                DragEvent.ACTION_DRAG_STARTED -> {
                    tvMonsterSpeech.text = "¡Dame la respuesta! 😋"
                    ivMonster.setBackgroundResource(R.drawable.monster_highlight)
                    true
                }
                DragEvent.ACTION_DRAG_ENTERED -> {
                    tvMonsterSpeech.text = "¡Aquí, aquí! 👄"
                    ivMonster.scaleX = 1.15f
                    ivMonster.scaleY = 1.15f
                    true
                }
                DragEvent.ACTION_DRAG_EXITED -> {
                    tvMonsterSpeech.text = "¡Dame la respuesta! 😋"
                    ivMonster.scaleX = 1f
                    ivMonster.scaleY = 1f
                    true
                }
                DragEvent.ACTION_DROP -> {
                    val draggedText = dragEvent.clipData.getItemAt(0).text.toString()
                    val draggedValue = draggedText.toIntOrNull() ?: return@setOnDragListener false

                    val sourceView = dragEvent.localState as? Button
                    sourceView?.alpha = 1f

                    validateAnswer(draggedValue)
                    true
                }
                DragEvent.ACTION_DRAG_ENDED -> {
                    ivMonster.scaleX = 1f
                    ivMonster.scaleY = 1f
                    ivMonster.setBackgroundResource(0)
                    for (btn in answerButtons) btn.alpha = 1f
                    true
                }
                else -> false
            }
        }
    }

    /**
     * Genera una nueva ronda con una multiplicación o división de 3er grado.
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
            val a = Random.nextInt(1, 11)
            val b = Random.nextInt(1, 11)
            "$a × $b = ?" to (a * b)
        } else {
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
            val offset = Random.nextInt(-3, 4)
            val distractor = answer + offset
            if (distractor > 0 && distractor != answer) {
                options.add(distractor)
            }
        }

        val shuffled = options.shuffled()
        for (i in answerButtons.indices) {
            answerButtons[i].text = shuffled[i].toString()
            answerButtons[i].visibility = View.VISIBLE
        }
    }

    /**
     * Valida si la respuesta arrastrada es correcta.
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
     * - Reproduce secuencia de tonos ascendentes (DO-MI-SOL) con ToneGenerator
     * - Anima al monstruo masticando
     * - Aumenta la puntuación
     * - Pasa a la siguiente ronda
     */
    private fun onCorrectAnswer() {
        score += 10
        round++
        tvScore.text = "⭐ $score"
        tvFeedback.text = "¡Correcto! El monstruo está feliz 😋"
        tvFeedback.setTextColor(Color.parseColor("#16A34A"))

        // Sonido de éxito: secuencia de 3 tonos ascendentes (sin MP3)
        playSuccessTones()

        animateMonsterEat()

        tvMonsterSpeech.text = "¡Ñam ñam! 😋"

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
     * - Reproduce tono grave de error
     * - Anima al monstruo sacudiéndose
     * - Resta una vida
     */
    private fun onWrongAnswer() {
        lives--
        tvLives.text = "❤️".repeat(lives) + "🖤".repeat(3 - lives)
        tvFeedback.text = "¡Ups! Esa no era. Intenta de nuevo 😖"
        tvFeedback.setTextColor(Color.parseColor("#DC2626"))

        vibrateError()
        playFailTone()

        animateMonsterShake()

        tvMonsterSpeech.text = "¡Esa no me gusta! 😤"

        if (lives <= 0) {
            dragTargetMonster.postDelayed({ endGame() }, 1500)
        }
    }

    /**
     * Reproduce secuencia de tonos ascendentes (DO-MI-SOL) usando ToneGenerator.
     * NO requiere archivos MP3 externos.
     */
    private fun playSuccessTones() {
        // Tono 1 (grave)
        toneGenerator?.startTone(ToneGenerator.TONE_PROP_BEEP, 100)
        dragTargetMonster.postDelayed({
            // Tono 2 (medio)
            toneGenerator?.startTone(ToneGenerator.TONE_PROP_BEEP2, 100)
        }, 120)
        dragTargetMonster.postDelayed({
            // Tono 3 (agudo)
            toneGenerator?.startTone(ToneGenerator.TONE_PROP_PROMPT, 150)
        }, 240)
    }

    /**
     * Reproduce un tono grave de error usando ToneGenerator.
     * NO requiere archivos MP3 externos.
     */
    private fun playFailTone() {
        toneGenerator?.startTone(TONE_FAIL, 300)
    }

    /**
     * Anima al monstruo "masticando" la respuesta correcta.
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
     * Anima al monstruo sacudiéndose horizontalmente.
     */
    private fun animateMonsterShake() {
        val shake = ObjectAnimator.ofFloat(
            ivMonster, "translationX",
            0f, -25f, 25f, -25f, 25f, -15f, 15f, 0f
        )
        shake.duration = 500
        shake.interpolator = DecelerateInterpolator()
        shake.start()

        ivMonster.setColorFilter(Color.parseColor("#66FF0000"))
        dragTargetMonster.postDelayed({
            ivMonster.clearColorFilter()
        }, 500)
    }

    /**
     * Vibración de error: patrón de 3 vibraciones cortas.
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
        // Tono de victoria
        toneGenerator?.startTone(TONE_WIN, 500)

        val message = when {
            score >= 80 -> "¡Excelente! Eres un genio de las matemáticas 🏆"
            score >= 50 -> "¡Muy bien! El monstruo quedó satisfecho 🎉"
            else -> "¡Sigue practicando! El monstruo tendrá más hambre otra vez 💪"
        }

        Toast.makeText(this, "$message\nPuntuación final: $score", Toast.LENGTH_LONG).show()

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
        // Liberar el ToneGenerator al cerrar la Activity
        toneGenerator?.release()
        toneGenerator = null
    }
}

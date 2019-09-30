package de.trabit.reportApp.login

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.os.Handler
import android.view.View
import android.widget.*
import com.google.firebase.messaging.FirebaseMessaging
import de.trabit.directionsApp.DirectionsActivity
import de.trabit.reportApp.R

class LoginActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        // subscribe to FCM topic
        FirebaseMessaging.getInstance().subscribeToTopic("RB25")

        //set progressbar animation
        val signInBtn = findViewById<RelativeLayout>(R.id.btn_next)
        val progressBar = findViewById<ProgressBar>(R.id.progressBar)
        val signInText = findViewById<TextView>(R.id.signInText)
        val checkImage = findViewById<ImageView>(R.id.validationIcon)

        signInText.visibility = View.VISIBLE
        signInBtn.setOnClickListener {
            progressBar.visibility = View.VISIBLE
            signInText.visibility = View.GONE
            Handler().postDelayed({
                run {
                    progressBar.visibility = View.GONE
                    checkImage.visibility = View.VISIBLE
                    val loginIntent = Intent (this, DirectionsActivity::class.java)
                    startActivity(loginIntent)
                }
            },1000)
        }
    }
}

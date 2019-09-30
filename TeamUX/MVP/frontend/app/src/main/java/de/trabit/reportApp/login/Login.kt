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

class Login : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        // subscribe to FCM topic
        FirebaseMessaging.getInstance().subscribeToTopic("RB25")

        //set progressbar animation

        val signInBtn = findViewById(R.id.btn_next) as RelativeLayout
        val progressBar = findViewById(R.id.progressBar) as ProgressBar
        val signInText = findViewById(R.id.signInText) as TextView
        val checkImage = findViewById(R.id.validationIcon) as ImageView

        signInText.visibility = View.VISIBLE

        signInBtn.setOnClickListener() {

            progressBar.visibility = View.VISIBLE
            signInText.setVisibility(View.GONE)

            Handler().postDelayed(Runnable(){
                run(){

                    val LoginIntent = Intent (this,
                        DirectionsActivity::class.java)
                    startActivity(LoginIntent)
                    progressBar.setVisibility(View.GONE)
                    checkImage.visibility = View.VISIBLE
                }
            },1000)
        }

    }
}

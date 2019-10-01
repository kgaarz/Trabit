package de.trabit.reportApp.login

import ErrorSnackbar
import SuccessSnackbar
import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.os.Handler
import android.view.View
import android.widget.*
import com.android.volley.Request
import com.android.volley.RequestQueue
import com.android.volley.Response
import com.android.volley.toolbox.StringRequest
import com.android.volley.toolbox.Volley
import com.example.api_test.dataClasses.User
import com.google.firebase.messaging.FirebaseMessaging
import com.google.gson.GsonBuilder
import de.trabit.directionsApp.DirectionsActivity
import de.trabit.reportApp.BuildConfig
import de.trabit.reportApp.R
import kotlinx.android.synthetic.main.activity_login.*
import kotlinx.android.synthetic.main.activity_profile.*

class LoginActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        // subscribe to FCM topic
        FirebaseMessaging.getInstance().subscribeToTopic("RB25")

        // get user data
        getUser(BuildConfig.DEMO_USERID)

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

    private fun getUser(userId: String) {
        val requestUrl = BuildConfig.REPORTAPI_BASE_URL + "users/$userId"
        val mQueue: RequestQueue = Volley.newRequestQueue(this)
        val request = StringRequest(Request.Method.GET, requestUrl,
            Response.Listener {
                val gson = GsonBuilder().create()
                val user = gson.fromJson(it.toString(), User::class.java)
                //set profile
                val firstname = "${user.username}"
                txtLoginName.setText(firstname)
                val passwordUserLogin = "${user.password}"
                txtLoginPassword.setText(passwordUserLogin)

            }, Response.ErrorListener {
                it.printStackTrace()
                ErrorSnackbar(Layout_profile).show("Abrufen des Profils fehlgeschlagen!")
            })
        mQueue.add(request)
    }
}



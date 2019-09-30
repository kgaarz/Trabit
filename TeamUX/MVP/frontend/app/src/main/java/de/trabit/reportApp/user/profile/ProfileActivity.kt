package de.trabit.reportApp.user.profile

import ErrorSnackbar
import SuccessSnackbar
import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.ImageButton
import com.android.volley.Request
import com.android.volley.RequestQueue
import com.android.volley.Response
import com.android.volley.toolbox.StringRequest
import com.android.volley.toolbox.Volley
import com.example.api_test.dataClasses.User
import com.google.gson.GsonBuilder
import de.trabit.reportApp.BuildConfig
import de.trabit.reportApp.R
import kotlinx.android.synthetic.main.activity_profile.*

class ProfileActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_profile)

        // check if changes were made in previous screen
        val profileSaved = intent.getBooleanExtra("profileSaved", false)
        val mobilitySaved = intent.getBooleanExtra("mobilitySaved", false)

        if (profileSaved) {
            SuccessSnackbar(Layout_profile).show("Änderungen am Profil wurden gespeichert!")
        }

        if (mobilitySaved) {
            SuccessSnackbar(Layout_profile).show("Änderungen an den Mobilitätsmöglichkeiten wurden gespeichert!")
        }

        // get user data
        getUser(BuildConfig.DEMO_USERID)

        //click button to edit profile
        val editProfileButton = findViewById<ImageButton>(R.id.btnEdit)
        editProfileButton.setOnClickListener {
            val editProfile = Intent(this, EditProfileActivity::class.java)
            startActivity(editProfile
                .putExtra("firstname", txtFirstnameData.text)
                .putExtra("lastname", txtLastnameData.text)
                .putExtra("email", txtMailData.text)
                .putExtra("residence", txtHomeData.text)
            )
        }

        //click button to edit mobility settings
        val editMobilitiesButton = findViewById<ImageButton>(R.id.btnEdit2)
        editMobilitiesButton.setOnClickListener {
            val editMobilities = Intent(this, EditMobilityActivity::class.java)
            startActivity(editMobilities
                .putExtra("car", mob1.isChecked)
                .putExtra("driversLicense", mob2.isChecked)
                .putExtra("bike", mob3.isChecked)
                .putExtra("trainTicket", mob4.isChecked)
                .putExtra("sharing", mob5.isChecked))
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
                nameProfile.text = user.username
                txtFirstnameData.text = user.profile.firstname
                txtLastnameData.text = user.profile.lastname
                txtMailData.text = user.profile.email
                txtHomeData.text = user.profile.residence
                //set mobility
                mob1.isChecked = user.availableMobilityOptions.car
                mob2.isChecked = user.availableMobilityOptions.driversLicense
                mob3.isChecked = user.availableMobilityOptions.bike
                mob4.isChecked = user.availableMobilityOptions.trainTicket
                mob5.isChecked = user.availableMobilityOptions.sharing
            }, Response.ErrorListener {
                it.printStackTrace()
                ErrorSnackbar(Layout_profile).show("Abrufen des Profils fehlgeschlagen!")
            })
        mQueue.add(request)
    }
}

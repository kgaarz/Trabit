package de.trabit.reportApp.user.profile

import ErrorSnackbar
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
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
        // get user data
        getUser(BuildConfig.DEMO_USERID)

        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_profile)
    }

    private fun getUser(userId: String) {
        val requestUrl = BuildConfig.REPORTAPI_BASE_URL + "users/$userId"
        val mQueue: RequestQueue = Volley.newRequestQueue(this)
        val request = StringRequest(Request.Method.GET, requestUrl,
            Response.Listener {
                val gson = GsonBuilder().create()
                val user = gson.fromJson(it.toString(), User::class.java)
                val fullname = "${user.profile.firstname} ${user.profile.lastname}"
                nameProfile.text = fullname
                txtNameData.text = fullname
                txtNicknameData.text = user.username
                txtMailData.text = user.profile.email
                txtHomeData.text = user.profile.residence
            }, Response.ErrorListener {
                it.printStackTrace()
                ErrorSnackbar(Layout_profile).show("Abrufen des Profils fehlgeschlagen!")
            })
        mQueue.add(request)
    }
}

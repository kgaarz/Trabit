package de.trabit.reportApp.user.profile

import ErrorSnackbar
import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.ImageButton
import com.android.volley.NetworkResponse
import com.android.volley.RequestQueue
import com.android.volley.Response
import com.android.volley.toolbox.HttpHeaderParser
import com.android.volley.toolbox.JsonObjectRequest
import com.android.volley.toolbox.Volley
import com.google.gson.Gson
import de.trabit.reportApp.BuildConfig
import de.trabit.reportApp.R
import de.trabit.reportApp.user.model.Profile
import kotlinx.android.synthetic.main.activity_edit_profile.*
import org.json.JSONException
import org.json.JSONObject

class EditProfileActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_edit_profile)

        //get user data
        val firstname = intent.getStringExtra("firstname")
        val lastname = intent.getStringExtra("lastname")
        val email = intent.getStringExtra("email")
        val residence = intent.getStringExtra("residence")

        val firstnameField = findViewById<EditText>(R.id.editName)
        firstnameField.setText(firstname)
        val lastnameField = findViewById<EditText>(R.id.editLastName)
        lastnameField.setText(lastname)
        val emailField = findViewById<EditText>(R.id.editMail)
        emailField.setText(email)
        val homeField = findViewById<EditText>(R.id.editHome)
        homeField.setText(residence)

        //go back to profile screen
        val backToProfile = findViewById<ImageButton>(R.id.btn_back)
        backToProfile.setOnClickListener {
            val backProfileIntent = Intent(this, ProfileActivity::class.java)
            startActivity(backProfileIntent)
        }

        //go back to profile screen after saving new settings
        val backAfterSave = findViewById<Button>(R.id.profile_send_button)
        backAfterSave.setOnClickListener {
            putUserProfile(BuildConfig.DEMO_USERID, Profile(firstnameField.text.toString(),lastnameField.text.toString(), emailField.text.toString(), homeField.text.toString()))
        }
    }

    private fun putUserProfile(userId: String, profile: Profile){
        val requestUrl = BuildConfig.REPORTAPI_BASE_URL + "users/$userId/profile"
        val profileObject = JSONObject(Gson().toJson(profile))
        val mQueue: RequestQueue = Volley.newRequestQueue(this)
        val request = object : JsonObjectRequest(Method.PUT, requestUrl, profileObject,
            Response.Listener {
                try {
                    val saveProfileIntent = Intent(this, ProfileActivity::class.java)
                    startActivity(saveProfileIntent.putExtra("profileSaved", true))
                } catch (e: JSONException) {
                    e.printStackTrace()
                    ErrorSnackbar(Layout_profile_edit).show("Speichern der Änderungen fehlgeschlagen!")
                }
            }, Response.ErrorListener {
                it.printStackTrace()
                val errorMsg = String(it.networkResponse.data, Charsets.UTF_8)
                ErrorSnackbar(Layout_profile_edit).show(errorMsg)
            }) {
            override fun parseNetworkResponse(response : NetworkResponse) : Response<JSONObject> {
                return if (response.data.isEmpty()) {
                    Response.success(null, HttpHeaderParser.parseCacheHeaders(response))
                } else {
                    super.parseNetworkResponse(response)
                }
            }
        }
        mQueue.add(request)
    }
}
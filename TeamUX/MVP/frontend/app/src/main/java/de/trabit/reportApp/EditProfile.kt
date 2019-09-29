package de.trabit.reportApp

import android.app.DownloadManager
import ErrorSnackbar
import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.text.Editable
import android.widget.Button
import android.widget.EditText
import android.widget.ImageButton
import com.android.volley.RequestQueue
import com.android.volley.Request
import com.android.volley.Response
import com.android.volley.toolbox.Volley
import com.android.volley.toolbox.StringRequest
import com.example.api_test.dataClasses.User
import com.google.gson.GsonBuilder
import de.trabit.reportApp.BuildConfig
import de.trabit.reportApp.user.profile.ProfileActivity
import de.trabit.reportApp.R
import kotlinx.android.synthetic.main.activity_edit_profile.*
import kotlinx.android.synthetic.main.comments_item.view.*

class EditProfile : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {

        //get user data
        getUser(BuildConfig.DEMO_USERID)

        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_edit_profile)

        //go back to profile screen
        val backToProfile = findViewById<ImageButton>(R.id.btn_back)
        backToProfile.setOnClickListener {
            val backProfileIntent = Intent(this, ProfileActivity::class.java)
            startActivity(backProfileIntent)
        }

        //go back to profile screen after saving new settings
        val backAfterSave = findViewById<Button>(R.id.profile_send_button)
        backAfterSave.setOnClickListener {
            val backAfterSaveIntent = Intent(this, ProfileActivity::class.java)
            startActivity(backAfterSaveIntent)
        }
    }

    private fun getUser(userId: String){
        val requestUrl = BuildConfig.REPORTAPI_BASE_URL + "users/$userId"
        val mQueue: RequestQueue = Volley.newRequestQueue(this)
        val request = StringRequest(Request.Method.GET, requestUrl, Response.Listener {
            val gson = GsonBuilder().create()
            val user = gson.fromJson(it.toString(), User::class.java)
            val firstname = "${user.profile.firstname}"
            editName.setText(firstname)
            val lastname = "${user.profile.lastname}"
            editLastName.setText(lastname)
            val mail = "${user.profile.email}"
            editMail.setText(mail)
            val home = "${user.profile.residence}"
            editHome.setText(home)
            val personalnickname = "${user.username}"
            editNickname.setText(personalnickname)
            val personalPassword = "${user.password}"
            editPassword.setText(personalPassword)
        }, Response.ErrorListener {
            it.printStackTrace()
            ErrorSnackbar(Layout_profile_edit).show("Bearbeiten fehlgeschlagen")
        })
        mQueue.add(request)

    }
}


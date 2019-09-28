package de.trabit.reportApp

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.Button
import android.widget.ImageButton
import de.trabit.reportApp.user.profile.ProfileActivity

class EditProfile : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
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
    }


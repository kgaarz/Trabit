package de.trabit.reportApp.user.profile

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.Button
import android.widget.ImageButton
import de.trabit.reportApp.R

class EditProfileMobilities : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_edit_profile_mobilities)

        val backToProfile = findViewById<ImageButton>(R.id.btn_back)
        backToProfile.setOnClickListener {
            val backProfileIntent = Intent(this, ProfileActivity::class.java)
            startActivity(backProfileIntent)
        }

        val backAfterSave = findViewById<Button>(R.id.profileMob_send_button)
        backAfterSave.setOnClickListener {
            val backAfterSaveIntent = Intent(this, ProfileActivity::class.java)
            startActivity(backAfterSaveIntent)
        }
    }
}

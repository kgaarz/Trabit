package de.trabit.faultdetector

import android.content.Intent
import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.widget.ImageButton

class OverviewActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_overview)


        //Add Clicklistener to Imagebutton (ArrowBack) and link to SearchActivity

        var btn = findViewById(R.id.locationChange) as ImageButton

        btn.setOnClickListener{

            val intent = Intent(this,SearchActivity::class.java)
            startActivity(intent)

        }



    }
}

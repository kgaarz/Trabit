package de.trabit.reportApp

import android.content.Intent
import android.os.Bundle
import android.widget.ImageButton
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import com.android.volley.Response
import com.android.volley.toolbox.StringRequest
import com.android.volley.toolbox.Volley
import com.android.volley.Request



class DirectionsActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_directions)

        val overviewIcon = findViewById(R.id.overviewNavigation) as ImageButton
        val profileIcon = findViewById(R.id.profileNavigation) as ImageButton
        val directionsIcon = findViewById(R.id.directonsNavigation) as ImageButton


        overviewIcon.setOnClickListener{
            overviewIcon.setImageResource(R.mipmap.overview_active)
            profileIcon.setImageResource(R.mipmap.profile)
        }

        profileIcon.setOnClickListener{
            profileIcon.setImageResource(R.mipmap.profile_active)
            overviewIcon.setImageResource(R.mipmap.overview)
        }

        directionsIcon.setOnClickListener {
            val intent = Intent(this, DirectionsActivity::class.java)
            startActivity(intent);
        }


        val textView = findViewById<TextView>(R.id.response)

        val queue = Volley.newRequestQueue(this)
        val url = "https://trabit-api-mk.herokuapp.com/traffics/5d5414fa043e699565a4795e"

        val stringRequest = StringRequest(Request.Method.GET, url,
            Response.Listener<String> { response ->
                // Display the first 500 characters of the response string.
                textView.text = "Response is: ${response.substring(0, 500)}"
            },
            Response.ErrorListener { textView.text = "That didn't work!" })

        queue.add(stringRequest)

    }
}

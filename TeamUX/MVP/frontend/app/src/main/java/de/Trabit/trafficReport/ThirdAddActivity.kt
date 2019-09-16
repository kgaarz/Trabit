package de.Trabit.trafficReport

import android.content.Intent
import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.widget.ImageButton
import android.widget.ImageView
import android.widget.TextView

class ThirdAddActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_third_add)

        //store the value (choosen means of transport and Id) in a variable

        val meansOfTransportName = intent.getStringExtra("meansOfTransport")
        val meansOfTransportId = intent.getStringExtra("meansOfTransportId")

        //Adapt the activity layout to the appropriate means of transport

        val imageMeansOfTransport = findViewById(R.id.imageMeansOfTransport) as ImageView
        val textMeansOfTransport = findViewById(R.id.textMeansOfTransport) as TextView

        when (meansOfTransportName) {

            "bus"   -> {
                imageMeansOfTransport.setImageResource(R.mipmap.bus_icon_clicked)
                textMeansOfTransport.setText("Bus")
            }
            "train" -> {
                imageMeansOfTransport.setImageResource(R.mipmap.train_icon_clicked)
                textMeansOfTransport.setText("Zug")
            }
            "tram"  -> {
                imageMeansOfTransport.setImageResource(R.mipmap.tram_icon_clicked)
                textMeansOfTransport.setText("Bahn")
            }
            "car" -> {
                imageMeansOfTransport.setImageResource(R.mipmap.car_icon_clicked)
                textMeansOfTransport.setText("Auto")
            }
        }

        //close Activity by clicking the x and go back to OverviewActivity

        val closeButton = findViewById(R.id.closeThirdAddBtn) as ImageButton

        closeButton.setOnClickListener{

            val closeIntent = Intent(this,OverviewActivity::class.java)
            startActivity(closeIntent)
        }

        //back Button Intent to SecondAddActivtiy

        val backBtnToSecondAddActivity = findViewById(R.id.btn_back3) as ImageButton

        backBtnToSecondAddActivity.setOnClickListener{
            val backIntent = Intent(this,SecondAddActivity::class.java)
            startActivity(backIntent)
        }

    }
}

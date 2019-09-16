package de.trabit.reportApp

import android.content.Intent
import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import android.widget.ImageButton
import android.widget.ImageView
import android.widget.RelativeLayout
import android.widget.TextView
import kotlinx.android.synthetic.main.activity_third_add.*

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

        val textTile1 = findViewById(R.id.textTile1) as TextView
        val textTile2 = findViewById(R.id.textTile2) as TextView
        val textTile3 = findViewById(R.id.textTile3) as TextView
        val textTile4 = findViewById(R.id.textTile4) as TextView
        val textTile5 = findViewById(R.id.textTile5) as TextView
        val textTile6 = findViewById(R.id.textTile6) as TextView

        val imageTile1 = findViewById(R.id.imageTile1) as ImageView
        val imageTile2 = findViewById(R.id.imageTile2) as ImageView
        val imageTile3 = findViewById(R.id.imageTile3) as ImageView
        val imageTile5 = findViewById(R.id.imageTile5) as ImageView
        val imageTile6 = findViewById(R.id.imageTile6) as ImageView

        val tile1 = findViewById(R.id.tile1) as RelativeLayout
        val tile2 = findViewById(R.id.tile2) as RelativeLayout
        val tile3 = findViewById(R.id.tile3) as RelativeLayout
        val tile4 = findViewById(R.id.tile4) as RelativeLayout
        val tile5 = findViewById(R.id.tile5) as RelativeLayout
        val tile6 = findViewById(R.id.tile6) as RelativeLayout

        when (meansOfTransportName) {

            "bus"   -> {
                imageMeansOfTransport.setImageResource(R.mipmap.bus_icon_clicked)
                textMeansOfTransport.setText("Bus")
                textTile1.setText("Verspätung")
                imageTile1.setImageResource(R.mipmap.time_icon)
                textTile2.setText("Entfällt")
                imageTile2.setImageResource(R.mipmap.stop_icon)
                tile3.visibility = View.INVISIBLE
                tile4.visibility = View.INVISIBLE
                tile5.visibility = View.INVISIBLE
                tile6.visibility = View.INVISIBLE
            }
            "train" -> {
                imageMeansOfTransport.setImageResource(R.mipmap.train_icon_clicked)
                textMeansOfTransport.setText("Zug")
                textTile1.setText("Verspätung")
                imageTile1.setImageResource(R.mipmap.time_icon)
                textTile2.setText("Entfällt")
                imageTile2.setImageResource(R.mipmap.stop_icon)
                textTile3.setText("Gleiswechsel")
                imageTile3.setImageResource(R.mipmap.detour_icon)
                tile4.visibility = View.INVISIBLE
                tile5.visibility = View.INVISIBLE
                tile6.visibility = View.INVISIBLE
            }
            "tram"  -> {
                imageMeansOfTransport.setImageResource(R.mipmap.tram_icon_clicked)
                textMeansOfTransport.setText("Bahn")
                textTile1.setText("Verspätung")
                imageTile1.setImageResource(R.mipmap.time_icon)
                textTile2.setText("Entfällt")
                imageTile2.setImageResource(R.mipmap.stop_icon)
                textTile3.setText("Gleiswechsel")
                imageTile3.setImageResource(R.mipmap.detour_icon)
                tile4.visibility = View.INVISIBLE
                tile5.visibility = View.INVISIBLE
                tile6.visibility = View.INVISIBLE
            }
            "car" -> {
                imageMeansOfTransport.setImageResource(R.mipmap.car_icon_clicked)
                textMeansOfTransport.setText("Auto")
                textTile1.setText("Stau")
                imageTile1.setImageResource(R.mipmap.trafficjam_icon)
                textTile2.setText("Umleitung")
                imageTile2.setImageResource(R.mipmap.detour_icon)
                textTile3.setText("Unfall")
                imageTile3.setImageResource(R.mipmap.cone_icon)
                textTile4.setText("Gesperrt")
                imageTile4.setImageResource(R.mipmap.stop_icon)
                tile5.visibility = View.INVISIBLE
                tile6.visibility = View.INVISIBLE
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
            finish()
        }

    }
}

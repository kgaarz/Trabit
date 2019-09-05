package de.trabit.faultdetector

import android.content.Intent
import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.widget.ImageButton
import kotlinx.android.synthetic.main.activity_overview.*

class OverviewActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_overview)


        //Find View By Id for ClickListener Add Clicklistener to Imagebutton (Location) and link to SearchActivity

        var locationBtn = findViewById(R.id.locationChange) as ImageButton

        locationBtn.setOnClickListener{

            val intent = Intent(this,SearchActivity::class.java)
            startActivity(intent)

        }

        //Find Views By Id for ClickListener

        var carBtn = findViewById(R.id.carIcon) as ImageButton
        var trainBtn = findViewById(R.id.trainIcon) as ImageButton
        var tramBtn = findViewById(R.id.tramIcon) as ImageButton
        var busBtn = findViewById(R.id.busIcon) as ImageButton

        //Set the train Button default on clicked

        trainBtn.setImageResource(R.mipmap.train_icon_clicked)

        //Add Clicklistener to Imagebuttons (Car, bus, train, tram icon) to Change Color of Image (Clicked)

        carBtn.setOnClickListener {

            carBtn.setImageResource(R.mipmap.car_icon_clicked)
            trainBtn.setImageResource(R.mipmap.train_icon_grey)
            tramBtn.setImageResource(R.mipmap.tram_icon_grey)
            busBtn.setImageResource(R.mipmap.bus_icon_grey)

        }

        trainBtn.setOnClickListener {
            trainBtn.setImageResource(R.mipmap.train_icon_clicked)
            carBtn.setImageResource(R.mipmap.car_icon_grey)
            tramBtn.setImageResource(R.mipmap.tram_icon_grey)
            busBtn.setImageResource(R.mipmap.bus_icon_grey)
        }

        tramBtn.setOnClickListener {
            tramBtn.setImageResource(R.mipmap.tram_icon_clicked)
            carBtn.setImageResource(R.mipmap.car_icon_grey)
            trainBtn.setImageResource(R.mipmap.train_icon_grey)
            busBtn.setImageResource(R.mipmap.bus_icon_grey)
        }

        busBtn.setOnClickListener {
            busBtn.setImageResource(R.mipmap.bus_icon_clicked)
            carBtn.setImageResource(R.mipmap.car_icon_grey)
            trainBtn.setImageResource(R.mipmap.train_icon_grey)
            tramBtn.setImageResource(R.mipmap.tram_icon_grey)


        }





    }
}

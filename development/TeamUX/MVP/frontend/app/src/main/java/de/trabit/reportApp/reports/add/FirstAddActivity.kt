package de.trabit.reportApp.reports.add

import android.content.Intent
import android.os.Bundle
import android.widget.ImageButton
import android.widget.ImageView
import android.widget.RelativeLayout
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import de.trabit.reportApp.R
import de.trabit.reportApp.reports.display.OverviewActivity

class FirstAddActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_first_add)

        //close Activity by clicking the x and go to overviewActivity
        val closeButton = findViewById<ImageButton>(R.id.closeFirstAddButton)

        closeButton.setOnClickListener{
            val closeIntent = Intent(this, OverviewActivity::class.java)
            startActivity(closeIntent)
        }

        //Intent to next Activity by clicking on the tiles. The chosen means of transport is stored and handed over to next activity
        val tramTile = findViewById<RelativeLayout>(R.id.tramTile)
        val trainTile = findViewById<RelativeLayout>(R.id.trainTile)
        val busTile = findViewById<RelativeLayout>(R.id.busTile)
        val carTile = findViewById<RelativeLayout>(R.id.carTile)

        var chosenMeansOfTransport : String

        trainTile.setOnClickListener{
            val trainImage = findViewById(R.id.trainTileImage) as ImageView
            trainImage.setImageResource(R.mipmap.train_icon_clicked)
            val trainText = findViewById(R.id.trainTileText) as TextView
            trainText.setTextColor(0xff1C6A9C.toInt())
            val nextAddActivtityIntent = Intent(this, SecondAddActivity::class.java)
            chosenMeansOfTransport ="train"
            nextAddActivtityIntent.putExtra("meansOfTransport", chosenMeansOfTransport)
            startActivity(nextAddActivtityIntent)
        }

        tramTile.setOnClickListener{
            val tramImage = findViewById(R.id.tramTileImage) as ImageView
            tramImage.setImageResource(R.mipmap.tram_icon_clicked)
            val tramText = findViewById(R.id.tramTileText) as TextView
            tramText.setTextColor(0xff1C6A9C.toInt())
            val nextAddActivtityIntent = Intent(this, SecondAddActivity::class.java)
            chosenMeansOfTransport ="subway"
            nextAddActivtityIntent.putExtra("meansOfTransport", chosenMeansOfTransport)
            startActivity(nextAddActivtityIntent)
        }

        busTile.setOnClickListener{
            val busImage = findViewById(R.id.busTileImage) as ImageView
            busImage.setImageResource(R.mipmap.bus_icon_clicked)
            val busText = findViewById(R.id.busTileText) as TextView
            busText.setTextColor(0xff1C6A9C.toInt())
            val nextAddActivtityIntent = Intent(this, SecondAddActivity::class.java)
            chosenMeansOfTransport ="bus"
            nextAddActivtityIntent.putExtra("meansOfTransport", chosenMeansOfTransport)
            startActivity(nextAddActivtityIntent)
        }

        carTile.setOnClickListener{
            val carImage = findViewById(R.id.carTileImage) as ImageView
            carImage.setImageResource(R.mipmap.car_icon_clicked)
            val carText = findViewById(R.id.carTileText) as TextView
            carText.setTextColor(0xff1C6A9C.toInt())
            val nextAddActivtityIntent = Intent(this, SecondAddActivity::class.java)
            chosenMeansOfTransport ="car"
            nextAddActivtityIntent.putExtra("meansOfTransport", chosenMeansOfTransport)
            startActivity(nextAddActivtityIntent)
        }
    }
}

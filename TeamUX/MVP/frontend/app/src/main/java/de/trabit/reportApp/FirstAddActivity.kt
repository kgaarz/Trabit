package de.trabit.reportApp

import android.content.Intent
import android.os.Bundle
import android.widget.ImageButton
import android.widget.RelativeLayout
import androidx.appcompat.app.AppCompatActivity

class FirstAddActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_first_add)

        //close Activity by clicking the x and go to overviewActivity
        val closeButton = findViewById<ImageButton>(R.id.closeFirstAddButton)

        closeButton.setOnClickListener{
            val closeIntent = Intent(this,OverviewActivity::class.java)
            startActivity(closeIntent)
        }

        //Intent to next Activity by clicking on the tiles. The chosen means of transport is stored and handed over to next activity
        val tramTile = findViewById<RelativeLayout>(R.id.tramTile)
        val trainTile = findViewById<RelativeLayout>(R.id.trainTile)
        val busTile = findViewById<RelativeLayout>(R.id.busTile)
        val carTile = findViewById<RelativeLayout>(R.id.carTile)

        var chosenMeansOfTransport : String

        trainTile.setOnClickListener{
            val nextAddActivtityIntent = Intent(this,SecondAddActivity::class.java)
            chosenMeansOfTransport ="train"
            nextAddActivtityIntent.putExtra("meansOfTransport", chosenMeansOfTransport)
            startActivity(nextAddActivtityIntent)
        }

        tramTile.setOnClickListener{
            val nextAddActivtityIntent = Intent(this,SecondAddActivity::class.java)
            chosenMeansOfTransport ="subway"
            nextAddActivtityIntent.putExtra("meansOfTransport", chosenMeansOfTransport)
            startActivity(nextAddActivtityIntent)
        }

        busTile.setOnClickListener{
            val nextAddActivtityIntent = Intent(this,SecondAddActivity::class.java)
            chosenMeansOfTransport ="bus"
            nextAddActivtityIntent.putExtra("meansOfTransport", chosenMeansOfTransport)
            startActivity(nextAddActivtityIntent)
        }

        carTile.setOnClickListener{
            val nextAddActivtityIntent = Intent(this,ThirdAddActivity::class.java)
            chosenMeansOfTransport ="car"
            nextAddActivtityIntent.putExtra("meansOfTransport", chosenMeansOfTransport)
            startActivity(nextAddActivtityIntent)
        }
    }
}

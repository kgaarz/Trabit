package de.Trabit.trafficReport

import android.content.Intent
import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.widget.ImageButton
import android.widget.RelativeLayout

class FirstAddActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_first_add)


        //close Activity by clicking the x and go to overviewActivity

        val closeButton = findViewById(R.id.closeFirstAddButton) as ImageButton

        closeButton.setOnClickListener{

            val closeIntent = Intent(this,OverviewActivity::class.java)
            startActivity(closeIntent)
        }

        //Intent to next Activity by clicking on the tiles. The choosen means of transport is stored and handed over to next activtiy

        val tramTile = findViewById(R.id.tramTile) as RelativeLayout
        val trainTile = findViewById(R.id.trainTile) as RelativeLayout
        val busTile = findViewById(R.id.busTile) as RelativeLayout
        val carTile = findViewById(R.id.carTile) as RelativeLayout

        var choosenMeansOfTransport : String

        tramTile.setOnClickListener{
            val nextAddActivtityIntent = Intent(this,SecondAddActivity::class.java)
            choosenMeansOfTransport ="tram"
            nextAddActivtityIntent.putExtra("meansOfTransport", choosenMeansOfTransport)
            startActivity(nextAddActivtityIntent)
        }

        trainTile.setOnClickListener{
            val nextAddActivtityIntent = Intent(this,SecondAddActivity::class.java)
            choosenMeansOfTransport ="train"
            nextAddActivtityIntent.putExtra("meansOfTransport", choosenMeansOfTransport)
            startActivity(nextAddActivtityIntent)
        }

        busTile.setOnClickListener{
            val nextAddActivtityIntent = Intent(this,SecondAddActivity::class.java)
            choosenMeansOfTransport ="bus"
            nextAddActivtityIntent.putExtra("meansOfTransport", choosenMeansOfTransport)
            startActivity(nextAddActivtityIntent)
        }

        carTile.setOnClickListener{
            val nextAddActivtityIntent = Intent(this,ThirdAddActivity::class.java)
            choosenMeansOfTransport ="car"
            nextAddActivtityIntent.putExtra("meansOfTransport", choosenMeansOfTransport)
            startActivity(nextAddActivtityIntent)
        }


    }
}

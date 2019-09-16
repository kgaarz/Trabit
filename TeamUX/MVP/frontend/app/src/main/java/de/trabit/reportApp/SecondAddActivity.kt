package de.trabit.reportApp

import android.content.Intent
import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.widget.*


class SecondAddActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_second_add)

        //store the value (choosen means of transport) in a variable

        val choosenMeansOfTransport = intent.getStringExtra("meansOfTransport")

        //Adapt the activity layout to the appropriate means of transport

        val imageMeansOftransport = findViewById(R.id.imageMeansOftransport) as ImageView
        val textMeansofTransport = findViewById(R.id.textMeansOfTransport) as TextView

        when (choosenMeansOfTransport) {

            "bus"   -> {
                imageMeansOftransport.setImageResource(R.mipmap.bus_icon_clicked)
                textMeansofTransport.setText("Bus")
            }
            "train" -> {
            imageMeansOftransport.setImageResource(R.mipmap.train_icon_clicked)
            textMeansofTransport.setText("Zug")
                }
            "tram"  -> {
                imageMeansOftransport.setImageResource(R.mipmap.tram_icon_clicked)
                textMeansofTransport.setText("Bahn")
            }
        }

        //close Activity by clicking the x and go back to OverviewActivity

        val closeButton = findViewById(R.id.closeSecondAddButton) as ImageButton

        closeButton.setOnClickListener{

            val closeIntent = Intent(this,OverviewActivity::class.java)
            startActivity(closeIntent)
        }

        //back Button Intent to FirstAddActivtiy

        val backBtnToFirstAddActivity = findViewById(R.id.btn_back) as ImageButton

        backBtnToFirstAddActivity.setOnClickListener{
            val backIntent = Intent(this,FirstAddActivity::class.java)
            startActivity(backIntent)
        }

        //read out user input from edittext (Id of Means of Transport)

        val meansOfTransportIdButton = findViewById(R.id.inputTextNr) as EditText
        val meansOfTansportId = meansOfTransportIdButton.getText()
        val confirmBtn = findViewById(R.id.btn_next) as Button

        //add intent to further button to hand off to SecondAddActivity, checking if something is written in the edittext field

        confirmBtn.setOnClickListener {
            if(meansOfTansportId.isEmpty() || meansOfTansportId.length== 0 || meansOfTansportId.equals("") || meansOfTansportId == null){
                val errorToast = Toast.makeText(
                    this@SecondAddActivity,
                    "Bitte gib zunächst eine Kennung ein.",
                    Toast.LENGTH_SHORT )
                    errorToast.show()

            } else {
                val lastAddActivtityIntent = Intent(this, ThirdAddActivity::class.java)
                lastAddActivtityIntent.putExtra("meansOfTransport", choosenMeansOfTransport)
                lastAddActivtityIntent.putExtra("meansOfTansportId", meansOfTansportId)
                startActivity(lastAddActivtityIntent)

            }

        }

    }
}



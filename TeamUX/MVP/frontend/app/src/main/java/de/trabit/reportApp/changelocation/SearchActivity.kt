package de.trabit.reportApp.changelocation

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.ImageButton
import android.widget.ListView
import android.widget.SearchView
import androidx.appcompat.app.AppCompatActivity
import de.trabit.reportApp.R
import de.trabit.reportApp.reports.display.OverviewActivity

class SearchActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_search)

        //Find View By Id for ClickListener
        var btn = findViewById<ImageButton>(R.id.backButton)

        //Add Clicklistener to Imagebutton (ArrowBack) and link back to OverviewActivity
        btn.setOnClickListener{

            val changeActivityIntent = Intent(this, OverviewActivity::class.java)
            startActivity(changeActivityIntent)
       }

        //Find View By Id For Listview
        val listview = findViewById<ListView>(R.id.listView)

        //Find View By Id For SearchView
        val searchView = findViewById<SearchView>(R.id.searchView)

        // Array of City Names (dummy data)
        val name = arrayOf(
            "Gummersbach", "Gundelfingen", "Stuttgart", "Sindelfingen", "Köln", "Hamburg", "Engelskirchen",
            "Düsseldorf", "Dortmund", "Overath", "Kiel", "Sindelfingen", "Berlin","Eschweiler","Aalen", "AAchen", "Aschaffenburg",
            "Bamberg","Berlin","Bruchsal","Calw","Cottbus","Cuxhafen","Crailsheim","Cloppenburg","Darmstadt","Ditzingen","Dresden",
            "Duisburg", "Delbrück", "Eisenach", "Emmendingen","Engen","Eppingen","Erding","Erlangen","Essen","Ettlingen","Euskirchen",
            "Flensburg","Frankfurt am Main","Frankfurt","Frechen","Freising","Freudenstadt","Fulda","Fürth","Füssen","Furtwangen","Füssen",
            "Geisingen","Geislingen","Göppingen","Göttingen","Günzburg","Gütersloh","Haigerloch","Heidelberg","Heilbronn","Herrenberg",
            "Hockenheim","Hornberg","Hückeswagen","Hüfingen","Hürth","Ingolstadt","Immenau","Ingelfingen","Jena","Kaiserslautern","Karlsruhe",
            "Kassel","Kempten","Kierspe","Koblenz","Konstanz","Künzelsau","Landshut","Leipzig","Leonberg","Lindau","Löffingen","Lörrach",
            "Ludwigsburg","Moers","Mosbach","Müllheim","Neuss","Nürnberg","Regensburg","Ravensburg","Rottweil"
        )

        listview.visibility = View.INVISIBLE
        val info = ArrayList<HashMap<String, String>>()

        // HashMap with all City Names
        var hashMap: HashMap<String, String>

        for (element in name) {
            hashMap = HashMap<String, String>()
            hashMap["name"] = element

            //Add HashMap to ArrayList
            info.add(hashMap)

            //Custom Adapter Class in that we pass Context and ArrayList<Hashmap<String,String>>
            val customAdapter = SearchCustomAdapter(this, info)

            //Set Adapter to ArrayList
            listview.adapter = customAdapter

            //On Click for ListView Item
            listview.setOnItemClickListener { _, _, position, _ ->

                //save the data from the chosen ListView Item in hashMap (name and maybe PlZ to unique identification?)
                val hashMap: HashMap<String, String> = customAdapter.getItem(position) as HashMap<String, String>
                val newLocation = hashMap["name"]

                val changeLocationIntent = Intent (this,
                    OverviewActivity::class.java)
                changeLocationIntent.putExtra("newLocation", newLocation)

                startActivity(changeLocationIntent)
            }

            searchView.setOnQueryTextListener(object : SearchView.OnQueryTextListener {
                override fun onQueryTextSubmit(query: String?): Boolean {
                    return false
                }

                /*onQueryTextChange ist called every time the query Text is changed by the user
                 */
                override fun onQueryTextChange(newText: String?): Boolean {

                    val text = newText
                    /*Call filter Method Created in Custom Adapter
                    This Method Filter ListView According to Search Keyword
                 */
                    customAdapter.filter(text,listview)
                    return false
                }
            })
        }
    }
}
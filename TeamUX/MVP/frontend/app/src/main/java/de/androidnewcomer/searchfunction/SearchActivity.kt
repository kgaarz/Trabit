package de.androidnewcomer.searchfunction

import android.os.Bundle
import android.support.v7.app.AppCompatActivity
import android.view.View
import android.widget.ListView
import android.widget.SearchView
import android.widget.Toast

class SearchActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        //Find View By Id For Listview
        val listview = findViewById(R.id.listView) as ListView

        //Find View By Id For SearchView
        val searchView = findViewById(R.id.searchView) as SearchView


        // Array of City Names

        val name = arrayOf(
            "Gummersbach", "Gundelfingen", "Stuttgart", "Sindelfingen", "Köln", "Hamburg", "Engelskirchen",
            "Düsseldorf", "Dortmund", "Overath", "Kiel", "Sindelfingen", "Berlin"

        )

        listview.visibility = View.INVISIBLE




        val info = ArrayList<HashMap<String, String>>()

        // HashMap with all City Names
        var hashMap: HashMap<String, String> = HashMap<String, String>()

        for (i in 0..name.size - 1) {
            hashMap = HashMap<String, String>()
            hashMap.put("name", name[i])


            //Add HashMap to ArrayList
            info.add(hashMap)


            //Custom Adapter Class in that we pass Context and ArrayList<Hashmap<String,String>>
            val customAdapter = CustomAdapter(this, info)


            //Set Adapter to ArrayList
            listview.adapter = customAdapter

            //On Click for ListView Item
            listview.setOnItemClickListener { adapterView, view, position, l ->

                //save the data from the choosen ListView Item in hashMap
                val hashMap: HashMap<String, String> = customAdapter.getItem(position) as HashMap<String, String>


            }

            searchView.setOnQueryTextListener(object : SearchView.OnQueryTextListener {
                override fun onQueryTextSubmit(query: String?): Boolean {
                    return false
                }

                /*onQueryTextChange ist called every time the query Text is changed by the user
                 */

                override fun onQueryTextChange(newText: String?): Boolean {

                    val text = newText
                    /*Calll filter Method Created in Custom Adapter
                    This Method Filter ListView According to Search Keyword
                 */
                    customAdapter.filter(text,listview)
                    return false
                }
            })

        }

    }}
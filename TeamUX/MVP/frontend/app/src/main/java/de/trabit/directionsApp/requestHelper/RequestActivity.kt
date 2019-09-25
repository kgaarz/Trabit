package de.trabit.directionsApp.requestHelper

import android.content.Context
import android.util.Log
import com.android.volley.Request
import com.android.volley.RequestQueue
import com.android.volley.Response
import com.android.volley.toolbox.JsonObjectRequest
import com.android.volley.toolbox.Volley
import de.trabit.reportApp.BuildConfig
import org.json.JSONException



class RequestActivity {
    fun getRequest(context: Context, path: String, id: String){

        val requestUrl = BuildConfig.DIRECTIONSAPI_BASE_URL + path + "/" + id
        val mQueue: RequestQueue = Volley.newRequestQueue(context)
        val request = JsonObjectRequest(Request.Method.GET, requestUrl, null,
            Response.Listener {
                try {
                    Log.i("TAG", it.toString())
                } catch (e: JSONException) {
                    e.printStackTrace()

                }
            }, Response.ErrorListener {
                it.printStackTrace()

            })
        mQueue.add(request)

    }
}
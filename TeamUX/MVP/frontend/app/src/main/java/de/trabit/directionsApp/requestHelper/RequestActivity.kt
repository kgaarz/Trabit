package de.trabit.directionsApp.requestHelper

import android.content.Context
import android.os.AsyncTask
import android.util.Log
import de.trabit.reportApp.BuildConfig
import okhttp3.OkHttpClient
import org.json.JSONObject




class RequestActivity {
    class GetRequest(context: Context, path: String, id: String): AsyncTask<Void, Void, JSONObject>(){

        private var currentContext: Context? = null
        private var currentPath: String = ""
        private var currentId: String = ""

        init {
            currentPath = path
            currentContext = context
            currentId = id
        }

        override fun doInBackground(vararg params: Void?): JSONObject {
            val client = OkHttpClient()
            val url = BuildConfig.DIRECTIONSAPI_BASE_URL + currentPath + "/" + currentId
            val request = okhttp3.Request.Builder().url(url).build()
            val response = client.newCall(request).execute()
            val stringData = response.body?.string()

            return JSONObject(stringData)
        }
    }

    class PostRequest(context: Context, path: String, userId: String, id: String, requestBody: JSONObject): AsyncTask<Void, Void, JSONObject>(){

        private var currentContext: Context? = null
        private var currentPath: String = ""
        private var currentUserId: String = ""
        private var currentId: String = ""
        private var currentRequestBody: JSONObject? = null

        init {
            currentPath = path
            currentContext = context
            currentUserId = userId
            currentId = id
            currentRequestBody = requestBody
        }

        override fun doInBackground(vararg params: Void?): JSONObject {
            val client = OkHttpClient()
            val url = BuildConfig.DIRECTIONSAPI_BASE_URL + currentPath + "/" + currentId
            val request = okhttp3.Request.Builder().url(url).build()
            val response = client.newCall(request).execute()
            var stringData = response.body?.string()
            val jsonData = JSONObject(stringData)
            return jsonData
        }
    }
}
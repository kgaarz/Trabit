package de.trabit.directionsApp.requestHelper

import android.content.Context
import android.os.AsyncTask
import de.trabit.reportApp.BuildConfig
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import org.json.JSONObject
import okhttp3.RequestBody.Companion.toRequestBody









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

    class PostRequest(context: Context, path: String, userId: String, id: String, requestBody: String): AsyncTask<Void, Void, String>(){
        val JSON = "application/json; charset=utf-8".toMediaType()

        private var currentContext: Context? = null
        private var currentPath: String = ""
        private var currentUserId: String = ""
        private var currentId: String = ""
        private var currentRequestBody: String? = ""

        init {
            currentPath = path
            currentContext = context
            currentUserId = userId
            currentId = id
            currentRequestBody = requestBody
        }

        override fun doInBackground(vararg params: Void?): String? {
            var body = currentRequestBody?.toRequestBody(JSON)
            val client = OkHttpClient()
            val url = BuildConfig.DIRECTIONSAPI_BASE_URL + currentPath + "/" + currentUserId + "/" + currentId
            val request = body?.let { okhttp3.Request.Builder().url(url).post(it).build() }
            val response = request?.let { client.newCall(it).execute() }
            var stringData = response?.body?.string()
            return stringData
        }
    }

    class PostRequestWithOneID(context: Context, path: String, userId: String, requestBody: String): AsyncTask<Void, Void, String>(){
        val JSON = "application/json; charset=utf-8".toMediaType()

        private var currentContext: Context? = null
        private var currentPath: String = ""
        private var currentUserId: String = ""
        private var currentRequestBody: String? = ""

        init {
            currentPath = path
            currentContext = context
            currentUserId = userId
            currentRequestBody = requestBody
        }

        override fun doInBackground(vararg params: Void?): String? {
            var body = currentRequestBody?.toRequestBody(JSON)
            val client = OkHttpClient()
            val url = BuildConfig.DIRECTIONSAPI_BASE_URL + currentPath + "/" + currentUserId
            val request = body?.let { okhttp3.Request.Builder().url(url).post(it).build() }
            val response = request?.let { client.newCall(it).execute() }
            var stringData = response?.body?.string()
            return stringData
        }
    }
}
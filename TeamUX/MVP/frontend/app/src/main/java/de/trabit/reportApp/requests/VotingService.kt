package de.trabit.reportApp.requests

import ErrorSnackbar
import android.view.View
import com.android.volley.Request
import com.android.volley.RequestQueue
import com.android.volley.Response
import com.android.volley.toolbox.StringRequest
import com.android.volley.toolbox.Volley
import com.google.gson.GsonBuilder
import de.trabit.reportApp.BuildConfig
import de.trabit.reportApp.shared.Votable

class VotingService (val view : View, val votingView : VotingView) {

    fun addUpvote(votable: Votable, userId: String) {
        // check if user already upvoted
        if (votable.metadata.upvotes.users.contains(userId)) {
            removeUpvote(votable, userId)
            return
        }
        println(votable)
        val requestUrl = BuildConfig.REPORTAPI_BASE_URL + "${votable.resourceName}/${votable._id}/upvotes"
        val mQueue: RequestQueue = Volley.newRequestQueue(view.context)
        val request = object : StringRequest(Method.PUT, requestUrl,
            Response.Listener {
                votingView.setUpvote()
                getVotes(votable)
            }, Response.ErrorListener {
                it.printStackTrace()
                ErrorSnackbar(view).show("Upvote fehlgeschlagen!")
            }) {
            override fun getHeaders(): MutableMap<String, String> {
                val headers = HashMap<String, String>()
                headers["userId"] = userId
                return headers
            }
        }
        mQueue.add(request)
    }

    fun addDownvote(votable: Votable, userId: String) {
        // check if user already downvoted
        if (votable.metadata.downvotes.users.contains(userId)) {
            removeDownvote(votable, userId)
            return
        }
        val requestUrl = BuildConfig.REPORTAPI_BASE_URL + "${votable.resourceName}/${votable._id}/downvotes"
        val mQueue: RequestQueue = Volley.newRequestQueue(view.context)
        val request = object : StringRequest(
            Method.PUT, requestUrl,
            Response.Listener {
                votingView.setDownvote()
                getVotes(votable)
            }, Response.ErrorListener {
                it.printStackTrace()
                ErrorSnackbar(view).show("Downvote fehlgeschlagen!")
            }) {
            override fun getHeaders(): MutableMap<String, String> {
                val headers = HashMap<String, String>()
                headers["userId"] = userId
                return headers
            }
        }
        mQueue.add(request)
    }

    private fun getVotes(votable: Votable) {
        val requestUrl = BuildConfig.REPORTAPI_BASE_URL + "${votable.resourceName}/${votable._id}"
        val mQueue: RequestQueue = Volley.newRequestQueue(view.context)
        val request = StringRequest(Request.Method.GET, requestUrl,
            Response.Listener {
                val gson = GsonBuilder().create()
                val result = gson.fromJson(it.toString(), Votable::class.java)
                votingView.setVotes((result.metadata.upvotes.amount - result.metadata.downvotes.amount))
                votable.metadata.upvotes = result.metadata.upvotes
                votable.metadata.downvotes = result.metadata.downvotes
            }, Response.ErrorListener {
                it.printStackTrace()
                ErrorSnackbar(view).show("Abrufen der Stimmen fehlgeschlagen!")
            })
        mQueue.add(request)
    }

    private fun removeUpvote(votable: Votable, userId: String) {
        val requestUrl = BuildConfig.REPORTAPI_BASE_URL + "${votable.resourceName}/${votable._id}/upvotes"
        val mQueue: RequestQueue = Volley.newRequestQueue(view.context)
        val request = object : StringRequest(Method.DELETE, requestUrl,
            Response.Listener {
                votingView.unsetUpvote()
                getVotes(votable)
            }, Response.ErrorListener {
                it.printStackTrace()
                ErrorSnackbar(view).show("Upvote entfernen fehlgeschlagen!")
            }) {
            override fun getHeaders(): MutableMap<String, String> {
                val headers = HashMap<String, String>()
                headers["userId"] = userId
                return headers
            }
        }
        mQueue.add(request)
    }

    private fun removeDownvote(votable: Votable, userId: String) {
        val requestUrl = BuildConfig.REPORTAPI_BASE_URL + "${votable.resourceName}/${votable._id}/downvotes"
        val mQueue: RequestQueue = Volley.newRequestQueue(view.context)
        val request = object : StringRequest(Method.DELETE, requestUrl,
            Response.Listener {
                votingView.unsetDownvote()
                getVotes(votable)
            }, Response.ErrorListener {
                it.printStackTrace()
                ErrorSnackbar(view).show("Downvote entfernen fehlgeschlagen!")
            }) {
            override fun getHeaders(): MutableMap<String, String> {
                val headers = HashMap<String, String>()
                headers["userId"] = userId
                return headers
            }
        }
        mQueue.add(request)
    }
}
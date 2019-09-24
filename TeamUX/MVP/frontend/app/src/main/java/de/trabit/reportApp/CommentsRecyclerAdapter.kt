package de.trabit.reportApp

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.api_test.dataClasses.Comment
import java.text.SimpleDateFormat
import java.util.*
import kotlin.collections.ArrayList


//Adapter Class to adapt the CommentsRecyclerview with the Layout
class CommentsRecyclerAdapter(val commentsList: ArrayList<Comment>) : RecyclerView.Adapter<CommentsRecyclerAdapter.ViewHolder>() {

    override fun onCreateViewHolder(p0: ViewGroup, p1: Int): ViewHolder {
        val v = LayoutInflater.from(p0.context).inflate(R.layout.comments_item, p0, false)
        return ViewHolder(v)
    }

    override fun onBindViewHolder(p0: ViewHolder, position: Int) {
        val comment = commentsList[position]

        // format date for comment view
        val dateFormatter = SimpleDateFormat("dd.MM.YYYY")
        val today = Calendar.getInstance()
        val yesterday = Calendar.getInstance()
        yesterday.add(Calendar.DAY_OF_YEAR, -1)
        val commentDate = when (dateFormatter.format(comment.created))
        {
            dateFormatter.format(today.time) -> "Heute"
            dateFormatter.format(today.time) -> "Gestern"
            else -> dateFormatter.format(comment.created)
        }

        // format time for comment view
        val timeFormatter = SimpleDateFormat("HH:MM")
        val commentTime = timeFormatter.format(comment.created)

        // calculate votes
        val votes = comment.metadata.upvotes - comment.metadata.downvotes

        p0.comment_day_text.text = commentDate
        p0.comment_time_text.text = commentTime
        p0.comment_username_text.text = comment.author
        p0.comment_text.text = comment.content
        p0.comment_confirm_index.text = votes.toString()
    }

    override fun getItemCount(): Int {
        return commentsList.size
    }

    class ViewHolder (itemView: View) : RecyclerView.ViewHolder(itemView) {
        val comment_day_text = itemView.findViewById(R.id.dayText) as TextView
        val comment_time_text = itemView.findViewById(R.id.timeText) as TextView
        val comment_username_text = itemView.findViewById(R.id.usernameText) as TextView
        val comment_confirm_index = itemView.findViewById(R.id.vote_number) as TextView
        val comment_text = itemView.findViewById(R.id.commentText) as TextView
    }
}
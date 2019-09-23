package de.trabit.reportApp

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView


//Adapter Class to adapt the CommentsRecyclerview with the Layout

class CommentsRecyclerAdapter(val commentsList: ArrayList<CommentsItem>) : RecyclerView.Adapter<CommentsRecyclerAdapter.ViewHolder>() {

    override fun onCreateViewHolder(p0: ViewGroup, p1: Int): CommentsRecyclerAdapter.ViewHolder {
        val v = LayoutInflater.from(p0.context).inflate(R.layout.comments_item, p0, false)
        return CommentsRecyclerAdapter.ViewHolder(v)
    }

    override fun onBindViewHolder(p0: CommentsRecyclerAdapter.ViewHolder, p1: Int) {
        val comment : CommentsItem = commentsList[p1]
        p0.comment_day_text.text = comment.dayText
        p0.comment_time_text.text = comment.timeText
        p0.comment_username_text.text = comment.usernameText
        p0.comment_text.text = comment.commentText
        p0.comment_confirm_index.text = comment.confirmIndex

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
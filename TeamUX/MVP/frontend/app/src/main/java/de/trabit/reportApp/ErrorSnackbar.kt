package de.trabit.reportApp

import android.support.design.widget.Snackbar
import android.support.v4.content.ContextCompat
import android.view.View

class ErrorSnackbar (val view : View) {
    fun show(message : String) {
        val snackbar = Snackbar.make(this.view, message, Snackbar.LENGTH_INDEFINITE).setAction("OK"){}
        val colorRed = ContextCompat.getColor(this.view.context, R.color.errorRed)
        val colorWhite = ContextCompat.getColor(this.view.context, R.color.colorWhite)
        snackbar.view.setBackgroundColor(colorRed)
        snackbar.setActionTextColor(colorWhite)
        snackbar.show()
    }
}
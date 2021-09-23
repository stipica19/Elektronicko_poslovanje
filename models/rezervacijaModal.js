import mongoose from "mongoose";

const rezervacijaSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    panel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Panel",
      required: true,
    },
    cijena: {
      type: Number,
      required: true,
    },
    odDatuma: {
      type: Date,
      required: true,
    },
    doDatuma: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Rezervacija = mongoose.model("Rezervacija", rezervacijaSchema);

export default Rezervacija;

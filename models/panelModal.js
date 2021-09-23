import mongoose from "mongoose";

const panelSchema = mongoose.Schema(
  {
    dimenzija: {
      type: String,
      required: true,
    },
    id_lokacija: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lokacija",
      required: true,
    },
    pocetna_cijena: {
      type: Number,
      required: true,
    },
    brojMjesta: {
      type: Number,
      required: true,
    },
    opis: {
      type: String,
      required: true,
    },
    images: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Panel = mongoose.model("Panel", panelSchema);

export default Panel;

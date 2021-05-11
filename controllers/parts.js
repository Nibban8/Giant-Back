import mongoose from 'mongoose';
import buildPart from '../models/buildPart.js';

// GET all parts

export const getParts = async (req, res) => {
  try {
    const buildParts = await buildPart.find();

    res.status(200).json(buildParts);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Get part by id

export const getPart = async (req, res) => {
  const { id: _id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send('Id invalido');

  try {
    const buildParts = await buildPart.findById(_id);

    res.status(200).json(buildParts);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Create part by id

export const partCreation = async (req, res) => {
  const part = req.body;
  const newPart = new buildPart(part);

  try {
    await newPart.save();
    res.status(201).json(newPart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update part by id

export const updatePart = async (req, res) => {
  const { id: _id } = req.params;
  const part = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send('Id invalido');

  const updatedPart = await buildPart.findByIdAndUpdate(_id, part, {
    new: true,
  });

  res.json(updatedPart);
};

// Delete part by id

export const deletePart = async (req, res) => {
  const { id: _id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send('Id invalido');

  const deletedPart = await buildPart.findByIdAndRemove(_id, { new: true });

  res.status(202).send('Componente eliminado de forma satisfactoria');
};

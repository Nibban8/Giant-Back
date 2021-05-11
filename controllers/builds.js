import mongoose from 'mongoose';
import buildDetail from '../models/buildDetail.js';

// Get builds

export const getBuilds = async (req, res) => {
  try {
    const buildDetails = await buildDetail.find().populate('parts');
    res.status(200).json(buildDetails);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Create build

export const createBuild = async (req, res) => {
  const part = req.body;
  const newBuild = new buildDetail(part);

  try {
    await newBuild.save();
    res.status(201).json(newBuild);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

// Update build by id

export const updateBuild = async (req, res) => {
  const { id: _id } = req.params;
  const part = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send('Id invalido');

  const updatedBuild = await buildDetail.findByIdAndUpdate(_id, part, {
    new: true,
  });

  res.json(updatedBuild);
};

// Delete build by id

export const deleteBuild = async (req, res) => {
  const { id: _id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send('Invalid Id');

  const deletedBuild = await buildDetail.findByIdAndRemove(_id, { new: true });

  res.status(202).send('Succesfully Deleted');
};

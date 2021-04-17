import buildPart from '../models/buildPart.js';

export const getParts = async (req, res) => {
  try {
    const buildParts = await buildPart.find();
    console.log(buildParts);
    res.status(200).json(buildParts);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const partCreation = async (req, res) => {
  const part = req.body;
  const newPart = new PostMessage(part);

  try {
    await newPart.save();
    res.status(201).json(newPart);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

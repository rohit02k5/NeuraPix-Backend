import express from 'express';
import * as dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const router = express.Router();

router.route('/').post(async (req, res) => {
  try {
    const { prompt } = req.body;

    // Call Hugging Face Stable Diffusion API
    const response = await fetch('https://api-inference.huggingface.co/models/CompVis/stable-diffusion-v1-4', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs: prompt }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate image');
    }

    // Convert binary data to Base64
    const buffer = await response.arrayBuffer();
    const base64Image = `data:image/png;base64,${Buffer.from(buffer).toString('base64')}`;

    // Send the Base64 encoded image to the frontend
    res.status(200).json({ photo: base64Image });
  } catch (error) {
    console.error('Error in Hugging Face route:', error);

    res.status(500).json({
      success: false,
      message: error.message || 'Something went wrong',
    });
  }
});

export default router;

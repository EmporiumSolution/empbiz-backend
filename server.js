const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Load environment variables
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: ['https://emporiumsolution.id', 'http://localhost:5173', 'http://localhost:5200'],
  methods: ['POST', 'GET'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Nodemailer transporter using SendGrid
const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  secure: false,
  auth: {
    user: 'apikey',
    pass: process.env.SENDGRID_API_KEY
  }
});

// Funding form endpoint
app.post('/api/funding', upload.fields([
  { name: 'companyProfile', maxCount: 1 },
  { name: 'financialReport', maxCount: 1 },
  { name: 'businessPlan', maxCount: 1 },
  { name: 'pitchDeck', maxCount: 1 },
  { name: 'otherDocuments', maxCount: 1 }
]), async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      position,
      companyName,
      industry,
      businessStage,
      fundingAmount,
      fundingPurpose,
      employeeCount,
      estimatedRevenue,
      annualRevenue,
      businessDescription,
      hasDocuments
    } = req.body;

    // Prepare attachments with unique filenames
    const attachments = [];
    const files = req.files;
    let fileCounter = 1;

    if (files) {
      if (files.companyProfile) {
        attachments.push({
          filename: `01_CompanyProfile_${files.companyProfile[0].originalname}`,
          path: files.companyProfile[0].path
        });
      }
      if (files.financialReport) {
        attachments.push({
          filename: `02_FinancialReport_${files.financialReport[0].originalname}`,
          path: files.financialReport[0].path
        });
      }
      if (files.businessPlan) {
        attachments.push({
          filename: `03_BusinessPlan_${files.businessPlan[0].originalname}`,
          path: files.businessPlan[0].path
        });
      }
      if (files.pitchDeck) {
        attachments.push({
          filename: `04_PitchDeck_${files.pitchDeck[0].originalname}`,
          path: files.pitchDeck[0].path
        });
      }
      if (files.otherDocuments) {
        attachments.push({
          filename: `05_OtherDocuments_${files.otherDocuments[0].originalname}`,
          path: files.otherDocuments[0].path
        });
      }
    }

    // Send email
    const mailOptions = {
      from: 'emporiumsolution777@gmail.com',
      to: 'emporiumsolution777@gmail.com',
      subject: `[Emporium Solution] New Funding Application - ${companyName}`,
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
          <div style="background: #ffffff; padding: 30px 20px; text-align: center; border-bottom: 4px solid #0a1628;">
            <h2 style="color: #0a1628; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;">Emporium Solution</h2>
            <p style="color: #475569; margin: 10px 0 0 0; font-size: 14px;">Your Business & Market Solution</p>
          </div>
          
          <div style="padding: 20px; font-size: 14px; color: #1e293b; line-height: 1.6;">
            <div style="background: #f8fafc; border-left: 4px solid #2563eb; padding: 15px; margin-bottom: 25px; border-radius: 0 4px 4px 0;">
              <p style="margin: 0; font-size: 13px; color: #475569;">
                <strong style="color: #0a1628;">⚠️ Notification:</strong> A new funding application has been submitted.
              </p>
            </div>
            
            <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
              <h3 style="color: #0a1628; font-size: 16px; font-weight: 600; margin: 0 0 15px 0; padding-bottom: 10px; border-bottom: 2px solid #2563eb;">👤 Applicant Details</h3>
              <p><strong>Name:</strong> ${fullName}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Phone:</strong> ${phone}</p>
              <p><strong>Position:</strong> ${position}</p>
            </div>
            
            <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
              <h3 style="color: #0a1628; font-size: 16px; font-weight: 600; margin: 0 0 15px 0; padding-bottom: 10px; border-bottom: 2px solid #2563eb;">🏢 Company Information</h3>
              <p><strong>Company:</strong> ${companyName}</p>
              <p><strong>Industry:</strong> ${industry}</p>
              <p><strong>Stage:</strong> ${businessStage}</p>
            </div>
            
            <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
              <h3 style="color: #0a1628; font-size: 16px; font-weight: 600; margin: 0 0 15px 0; padding-bottom: 10px; border-bottom: 2px solid #2563eb;">💰 Funding Requirements</h3>
              <p><strong>Amount:</strong> ${fundingAmount}</p>
              <p><strong>Purpose:</strong> ${fundingPurpose}</p>
              <p><strong>Employees:</strong> ${employeeCount}</p>
              <p><strong>Est. Revenue:</strong> ${estimatedRevenue}</p>
              <p><strong>Annual Profit:</strong> ${annualRevenue}</p>
            </div>
            
            <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
              <h3 style="color: #0a1628; font-size: 16px; font-weight: 600; margin: 0 0 15px 0; padding-bottom: 10px; border-bottom: 2px solid #2563eb;">📝 Business Description</h3>
              <p>${businessDescription}</p>
            </div>
            
            <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
              <h3 style="color: #0a1628; font-size: 16px; font-weight: 600; margin: 0 0 15px 0; padding-bottom: 10px; border-bottom: 2px solid #2563eb;">📄 Documents Attached</h3>
              <p>Files are attached to this email (${attachments.length} file${attachments.length !== 1 ? 's' : ''})</p>
              <p><strong>Has Business Plan/Pitch Deck:</strong> ${hasDocuments === 'true' || hasDocuments === 'Ya' ? 'Yes' : 'No'}</p>
            </div>
          </div>
          
          <div style="background: #f8fafc; border-top: 2px solid #e2e8f0; padding: 20px; text-align: center;">
            <p style="color: #64748b; font-size: 12px; margin: 0;">
              This email was sent from <strong style="color: #0a1628;">emporiumsolution.id</strong>
            </p>
            <p style="color: #94a3b8; font-size: 11px; margin: 8px 0 0 0;">
              © 2026 Emporium Solution. All rights reserved.
            </p>
          </div>
        </div>
      `,
      attachments: attachments
    };

    await transporter.sendMail(mailOptions);

    // Clean up uploaded files after sending
    if (files) {
      Object.values(files).forEach(fileArray => {
        fileArray.forEach(file => {
          fs.unlink(file.path, (err) => {
            if (err) console.error('Error deleting file:', err);
          });
        });
      });
    }

    res.json({ success: true, message: 'Application submitted successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Error submitting application' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

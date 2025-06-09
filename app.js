import express from "express";
import session from "express-session";
import passport from "passport";
import crypto from "crypto";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "url";
//import pgpool from './database/pool.js';
import routes from "./routes/index.js";
import "./config/passport.js";
import { PrismaClient, Prisma } from "./generated/prisma/index.js";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";


dotenv.config();

const app = express();

//Sessionsetup
app.use(
  session({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // ms
    },
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(new PrismaClient(), {
      checkPeriod: 2 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);

app.use(passport.session());

// __dirname workaround for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set EJS as the view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Serve static assets (CSS, images, etc.)
app.use(express.static(path.join(__dirname, "public")));

// JSON parsing middleware
app.use(express.json());

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Router
app.use(routes);

// Start the session
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Express app listening on port ${PORT}!`));



//Cloud stuff

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://veacmefrdaemsnyrnrho.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)
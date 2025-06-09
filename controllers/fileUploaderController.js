import { body, query, validationResult } from "express-validator";
import passport from "passport";
import pswdUtils from "../lib/passwordUtils.js";
import { validateNewFolder } from "../lib/validateUser.js";
import { PrismaClient } from "../generated/prisma/index.js";


const prisma = new PrismaClient();

export const getHome = async (req, res) => {
  try {
    const rows = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
      include: {
        Files: true,
        Folders: true,
      },
    });

    let files = [];
    let folders = [];

    for (let i = 0; i < rows.Files.length; i++) {
      //Getting the full names

      files[i] = rows.Files[i];

      //Getting the date in a nicer format
      const date = new Date(rows.Files[i].timeUploaded);
      const formattedDate = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      files[i].formatted_date = formattedDate;
    }

    for (let i = 0; i < rows.Folders.length; i++) {
      folders[i] = rows.Folders[i];
    }

    res.render("home", {
      files: files,
      folders: folders,
    });
  } catch (err) {
    // Handle database error
    console.error(err);
    res.status(500).render("home", {
      errors: [{ msg: "Something went wrong." }],
    });
  }
};

export const postUpload = async (req, res) => {
  console.log(req.file);
  try {

  } catch (err) {
    console.error(err);
    return res.status(500).render("home", {
      errors: [{ msg: "Something went wrong during upload." }],
    });
  }
  try {
    const newFile = await prisma.user.update({
      where: {
        id: req.user.id,
      },
      data: {
        Files: {
          create: {
            originalName: req.file.originalname,
            size: req.file.size,
            timeUploaded: new Date(),
            fileName: req.file.filename,
            filePath: req.file.path,
          },
        },
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).render("home", {
      errors: [{ msg: "Something went wrong during upload." }],
    });
  }
  res.redirect("/home");
};

export const postDelete = async (req, res) => {
  try {
    const deleteFile = await prisma.files.delete({
      where: {
        id: parseInt(req.params.fileID),
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).render("home", {
      errors: [{ msg: "Something went wrong." }],
    });
  }
  res.redirect("/home");
};

export const postNewFolder = [
  validateNewFolder,
  async (req, res) => {
    const validateErrors = validationResult(req);
    if (!validateErrors.isEmpty()) {
      console.log(req.body.folderName);
      return res.status(400).render("home", {
        errors: validateErrors.array(),
      });
    }

    try {
      const newFolder = await prisma.user.update({
        where: {
          id: req.user.id,
        },
        data: {
          Folders: {
            create: {
              folderName: req.body.folderName,
            },
          },
        },
      });
    } catch (err) {
      console.error(err);
      return res.status(500).render("home", {
        errors: [{ msg: "Something went wrong." }],
      });
    }
    res.redirect("/home");
  },
];

export const deleteFolder = async (req, res) => {
  try {
    const deleteFolder = await prisma.folders.delete({
      where: {
        id: parseInt(req.params.folderID),
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).render("home", {
      errors: [{ msg: "Something went wrong." }],
    });
  }
  res.redirect("/home");
};
export const postMoveFolder = async (req, res) => {
  try {
    await prisma.files.update({
      where: {
        id: parseInt(req.params.fileID),
      },
      data: {
        folder: req.body.folderID
          ? { connect: { id: parseInt(req.body.folderID) } }
          : { disconnect: true },
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).render("home", {
      errors: [{ msg: "Something went wrong." }],
    });
  }
  res.redirect("/home");
};

//I have no idea if this works or not. Finish here
export const getFolder = async (req, res) => {
  try {
    const currentFolderID = await prisma.folders.findUnique({
      where: {
        folderName_userId: {
          folderName: req.params.folderName,
          userId: req.user.id,
        },
      },
      include: {
        files: true,
      },
    });

    let files = [];
    let folders = [];

    for (let i = 0; i < currentFolderID.files.length; i++) {
      //Getting the full names

      files[i] = currentFolderID.files[i];

      //Getting the date in a nicer format
      const date = new Date(currentFolderID.files[i].timeUploaded);
      const formattedDate = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      files[i].formatted_date = formattedDate;
    }
    res.render("home", {
      files: files,
      folders: folders,
    });
  } catch (err) {
    // Handle database error
    console.error(err);
    res.status(500).render("home", {
      errors: [{ msg: "Something went wrong." }],
    });
  }
};

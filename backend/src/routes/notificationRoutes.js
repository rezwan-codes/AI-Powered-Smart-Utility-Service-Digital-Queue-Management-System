import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

router.get("/notifications", async (req, res, next) => {
  try {
    const user = req.user;
    const notifications = await prisma.notification.findMany({
      where: {
        recipientId: user.id,
        recipientRole: user.role,
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    res.json({ notifications });
  } catch (error) {
    next(error);
  }
});

router.get("/notifications/unread-count", async (req, res, next) => {
  try {
    const user = req.user;
    const count = await prisma.notification.count({
      where: {
        recipientId: user.id,
        recipientRole: user.role,
        isRead: false,
      },
    });

    res.json({ count });
  } catch (error) {
    next(error);
  }
});

router.post("/notifications/:id/read", async (req, res, next) => {
  try {
    const user = req.user;
    const { id } = req.params;

    const notification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    if (notification.recipientId !== user.id || notification.recipientRole !== user.role) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updated = await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });

    res.json({ notification: updated });
  } catch (error) {
    next(error);
  }
});

router.post("/notifications/mark-all-read", async (req, res, next) => {
  try {
    const user = req.user;

    await prisma.notification.updateMany({
      where: {
        recipientId: user.id,
        recipientRole: user.role,
        isRead: false,
      },
      data: { isRead: true },
    });

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

export default router;

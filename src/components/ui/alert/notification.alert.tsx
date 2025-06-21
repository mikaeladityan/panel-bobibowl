// components/ui/alert/notification-alert.tsx
"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";
import { notificationAtom, setNotificationAtom } from "~/store";
import { IconX, IconInfoCircle } from "@tabler/icons-react";
import { SlideInContainer } from "./section.alert";

export function NotificationAlert() {
    const notification = useAtomValue(notificationAtom);
    const setNotification = useSetAtom(setNotificationAtom);
    const [isClosing, setIsClosing] = useState(false);
    const handleClose = useCallback(() => {
        setIsClosing(true);
        setTimeout(() => {
            setNotification({ title: "", message: "" });
            setIsClosing(false);
        }, 400);
    }, [setNotification]);
    useEffect(() => {
        if (notification.message) {
            const timer = setTimeout(() => {
                handleClose();
            }, 6000);
            return () => clearTimeout(timer);
        }
    }, [notification, handleClose]);

    if (!notification.message) return null;

    return (
        <SlideInContainer>
            <div
                className={`max-w-md w-full bg-white border border-sky-200 shadow-xl rounded-xl overflow-hidden transition-all duration-400 ${
                    isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"
                }`}
            >
                <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-sky-700 to-sky-400 text-white">
                    <div className="flex items-center gap-2">
                        <IconInfoCircle size={20} />
                        <h3 className="font-bold">{notification.title || "Notification"}</h3>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-1 rounded-full text-red hover:text-red transition-colors"
                    >
                        <IconX size={18} />
                    </button>
                </div>

                <div className="px-4 py-3 text-gray-700 text-sm">{notification.message}</div>

                {/* Progress bar */}
                <div className="h-1 w-full bg-sky-200 overflow-hidden">
                    <div className="h-full bg-sky-900 animate-progress"></div>
                </div>
            </div>
        </SlideInContainer>
    );
}

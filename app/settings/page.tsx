"use client";

import { useState, useEffect } from "react";
import {
    User,
    Shield,
    Lock,
    Bell,
    Eye,
    Heart,
    Bookmark,
    MessageCircle,
    HelpCircle,
    Info,
    ChevronRight,
    LogOut,
    MapPin,
    Link2,
    Briefcase,
    Phone
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { useAuth } from "@/lib/hooks/useAuth";
import { getUserData, updateUserData } from "@/lib/services/firestore";
import { useRouter } from "next/navigation";
import { profileSchema } from "@/lib/validations/schemas";

type SettingsSection =
    | "edit-profile"
    | "notifications"
    | "privacy"
    | "security"
    | "help"
    | "about";

interface MenuItem {
    id: SettingsSection;
    label: string;
    icon: any;
    description?: string;
}

export default function SettingsPage() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [activeSection, setActiveSection] = useState<SettingsSection>("edit-profile");
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    // Form states
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [profilePicture, setProfilePicture] = useState("");
    const [email, setEmail] = useState("");
    const [website, setWebsite] = useState("");
    const [location, setLocation] = useState("");
    const [occupation, setOccupation] = useState("");
    const [phone, setPhone] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);

    // Notification settings
    const [notifyPush, setNotifyPush] = useState(true);
    const [notifyLikes, setNotifyLikes] = useState(true);
    const [notifyComments, setNotifyComments] = useState(true);
    const [notifyFollows, setNotifyFollows] = useState(true);
    const [notifyMessages, setNotifyMessages] = useState(true);

    useEffect(() => {
        if (user) {
            loadUserData();
        }
    }, [user]);

    const loadUserData = async () => {
        if (!user) return;
        const data = await getUserData(user.uid);
        if (data) {
            setUserData(data);
            setName(data.name);
            setBio(data.bio || "");
            setProfilePicture(data.profilePicture || "");
            setEmail(user.email || "");
            setWebsite(data.website || "");
            setLocation(data.location || "");
            setOccupation(data.occupation || "");
            setPhone(data.phone || "");
            setIsPrivate(data.isPrivate || false);
            // Load notification settings
            setNotifyPush(data.notifyPush !== false);
            setNotifyLikes(data.notifyLikes !== false);
            setNotifyComments(data.notifyComments !== false);
            setNotifyFollows(data.notifyFollows !== false);
            setNotifyMessages(data.notifyMessages !== false);
        }
    };

    const handleSaveProfile = async () => {
        if (!user) return;

        // Validation
        const validationResult = profileSchema.safeParse({
            displayName: name,
            bio: bio,
            website: website,
            location: location,
        });

        if (!validationResult.success) {
            setMessage({ type: "error", text: validationResult.error.issues[0].message });
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            await updateUserData(user.uid, {
                name,
                bio,
                profilePicture,
                website,
                location,
                occupation,
                phone,
            });
            setMessage({ type: "success", text: "Profile updated successfully!" });
            setTimeout(() => setMessage(null), 3000);
        } catch (error: any) {
            setMessage({ type: "error", text: error.message || "Failed to update profile" });
        } finally {
            setLoading(false);
        }
    };

    const handleSavePrivacy = async () => {
        if (!user) return;
        setLoading(true);
        setMessage(null);

        try {
            await updateUserData(user.uid, { isPrivate });
            setMessage({ type: "success", text: "Privacy settings updated!" });
            setTimeout(() => setMessage(null), 3000);
        } catch (error: any) {
            setMessage({ type: "error", text: error.message || "Failed to update privacy" });
        } finally {
            setLoading(false);
        }
    };

    const handleSaveNotifications = async () => {
        if (!user) return;
        setLoading(true);
        setMessage(null);

        try {
            await updateUserData(user.uid, {
                notifyPush,
                notifyLikes,
                notifyComments,
                notifyFollows,
                notifyMessages,
            });
            setMessage({ type: "success", text: "Notification settings saved!" });
            setTimeout(() => setMessage(null), 3000);
        } catch (error: any) {
            setMessage({ type: "error", text: error.message || "Failed to save notifications" });
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            router.push("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const menuItems: MenuItem[] = [
        { id: "edit-profile", label: "Edit Profile", icon: User, description: "Name, bio, profile picture" },
        { id: "notifications", label: "Notifications", icon: Bell, description: "Manage notifications" },
        { id: "privacy", label: "Privacy", icon: Eye, description: "Account privacy settings" },
        { id: "security", label: "Security", icon: Lock, description: "Password and security" },
        { id: "help", label: "Help", icon: HelpCircle, description: "Support and FAQs" },
        { id: "about", label: "About", icon: Info, description: "App information" },
    ];

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="border-b border-slate-800 px-6 py-4">
                    <h1 className="text-2xl font-semibold text-white">Settings</h1>
                </div>

                <div className="flex">
                    {/* Sidebar Navigation */}
                    <div className="w-80 border-r border-slate-800 min-h-[calc(100vh-73px)]">
                        <nav className="py-4">
                            {menuItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveSection(item.id)}
                                    className={`w-full px-6 py-3 flex items-center gap-3 transition-all ${activeSection === item.id
                                        ? "bg-slate-800/50 border-l-2 border-accent-indigo"
                                        : "hover:bg-slate-800/30"
                                        }`}
                                >
                                    <item.icon className="w-5 h-5 text-slate-400" />
                                    <div className="flex-1 text-left">
                                        <p className={`text-sm font-medium ${activeSection === item.id ? "text-white" : "text-slate-300"
                                            }`}>
                                            {item.label}
                                        </p>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-slate-500" />
                                </button>
                            ))}

                            {/* Logout Button */}
                            <button
                                onClick={handleLogout}
                                className="w-full px-6 py-3 flex items-center gap-3 hover:bg-red-500/10 transition-all mt-4 border-t border-slate-800"
                            >
                                <LogOut className="w-5 h-5 text-red-400" />
                                <p className="text-sm font-medium text-red-400">Logout</p>
                            </button>
                        </nav>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 p-8">
                        {/* Message */}
                        {message && (
                            <div
                                className={`mb-6 p-4 rounded-lg ${message.type === "success"
                                    ? "bg-green-500/10 border border-green-500/20 text-green-400"
                                    : "bg-red-500/10 border border-red-500/20 text-red-400"
                                    }`}
                            >
                                {message.text}
                            </div>
                        )}

                        {/* Edit Profile Section */}
                        {activeSection === "edit-profile" && (
                            <div className="max-w-2xl">
                                <h2 className="text-2xl font-semibold text-white mb-2">Edit Profile</h2>
                                <p className="text-slate-400 mb-8">Update your personal information and profile details</p>

                                <div className="space-y-8">
                                    {/* Profile Picture */}
                                    <div className="pb-8 border-b border-slate-800">
                                        <ImageUpload
                                            value={profilePicture}
                                            onChange={setProfilePicture}
                                            label="Profile Picture"
                                            rounded={true}
                                            size="lg"
                                        />
                                    </div>

                                    {/* Basic Information */}
                                    <div className="space-y-6">
                                        <h3 className="text-lg font-semibold text-white">Basic Information</h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                                    Full Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-accent-indigo transition-colors"
                                                    placeholder="John Doe"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                                    Username
                                                </label>
                                                <input
                                                    type="text"
                                                    value={userData?.username || ""}
                                                    disabled
                                                    className="w-full bg-slate-800/30 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-500 cursor-not-allowed"
                                                />
                                                <p className="text-xs text-slate-500 mt-1.5">Username cannot be changed</p>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                                Bio
                                            </label>
                                            <textarea
                                                value={bio}
                                                onChange={(e) => setBio(e.target.value)}
                                                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-accent-indigo resize-none transition-colors"
                                                rows={4}
                                                maxLength={150}
                                                placeholder="Tell us about yourself..."
                                            />
                                            <p className="text-xs text-slate-500 mt-1.5">{bio.length}/150 characters</p>
                                        </div>
                                    </div>

                                    {/* Contact Information */}
                                    <div className="space-y-6 pt-6 border-t border-slate-800">
                                        <h3 className="text-lg font-semibold text-white">Contact Information</h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                                                    <MapPin className="w-4 h-4" />
                                                    Location
                                                </label>
                                                <input
                                                    type="text"
                                                    value={location}
                                                    onChange={(e) => setLocation(e.target.value)}
                                                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-accent-indigo transition-colors"
                                                    placeholder="City, Country"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                                                    <Phone className="w-4 h-4" />
                                                    Phone Number
                                                </label>
                                                <input
                                                    type="tel"
                                                    value={phone}
                                                    onChange={(e) => setPhone(e.target.value)}
                                                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-accent-indigo transition-colors"
                                                    placeholder="+1 (555) 000-0000"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                value={email}
                                                disabled
                                                className="w-full bg-slate-800/30 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-500 cursor-not-allowed"
                                            />
                                            <p className="text-xs text-slate-500 mt-1.5">Email is managed by your account</p>
                                        </div>
                                    </div>

                                    {/* Professional Information */}
                                    <div className="space-y-6 pt-6 border-t border-slate-800">
                                        <h3 className="text-lg font-semibold text-white">Professional Information</h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                                                    <Briefcase className="w-4 h-4" />
                                                    Occupation
                                                </label>
                                                <input
                                                    type="text"
                                                    value={occupation}
                                                    onChange={(e) => setOccupation(e.target.value)}
                                                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-accent-indigo transition-colors"
                                                    placeholder="Software Developer"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                                                    <Link2 className="w-4 h-4" />
                                                    Website
                                                </label>
                                                <input
                                                    type="url"
                                                    value={website}
                                                    onChange={(e) => setWebsite(e.target.value)}
                                                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-accent-indigo transition-colors"
                                                    placeholder="https://yourwebsite.com"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Save Button */}
                                    <div className="pt-6">
                                        <Button
                                            onClick={handleSaveProfile}
                                            disabled={loading}
                                            className="w-full md:w-auto px-8"
                                            size="lg"
                                        >
                                            {loading ? "Saving..." : "Save Changes"}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Notifications Section */}
                        {activeSection === "notifications" && (
                            <div className="max-w-xl">
                                <h2 className="text-xl font-semibold text-white mb-6">Notifications</h2>

                                <div className="space-y-4">
                                    <SettingItem
                                        icon={Bell}
                                        title="Push Notifications"
                                        description="Receive notifications about your activity"
                                        toggle={notifyPush}
                                        onToggle={() => setNotifyPush(!notifyPush)}
                                    />
                                    <SettingItem
                                        icon={Heart}
                                        title="Likes"
                                        description="Get notified when someone likes your post"
                                        toggle={notifyLikes}
                                        onToggle={() => setNotifyLikes(!notifyLikes)}
                                    />
                                    <SettingItem
                                        icon={MessageCircle}
                                        title="Comments"
                                        description="Get notified about new comments"
                                        toggle={notifyComments}
                                        onToggle={() => setNotifyComments(!notifyComments)}
                                    />
                                    <SettingItem
                                        icon={User}
                                        title="New Followers"
                                        description="Get notified when someone follows you"
                                        toggle={notifyFollows}
                                        onToggle={() => setNotifyFollows(!notifyFollows)}
                                    />
                                    <SettingItem
                                        icon={MessageCircle}
                                        title="Direct Messages"
                                        description="Get notified about new messages"
                                        toggle={notifyMessages}
                                        onToggle={() => setNotifyMessages(!notifyMessages)}
                                    />
                                </div>

                                <Button
                                    onClick={handleSaveNotifications}
                                    disabled={loading}
                                    className="w-full mt-6"
                                >
                                    {loading ? "Saving..." : "Save Notification Settings"}
                                </Button>
                            </div>
                        )}

                        {/* Privacy Section */}
                        {activeSection === "privacy" && (
                            <div className="max-w-xl">
                                <h2 className="text-xl font-semibold text-white mb-6">Privacy</h2>

                                <div className="space-y-4">
                                    <SettingItem
                                        icon={Lock}
                                        title="Private Account"
                                        description="Only approved followers can see your posts"
                                        toggle={isPrivate}
                                        onToggle={() => setIsPrivate(!isPrivate)}
                                    />
                                </div>

                                <Button
                                    onClick={handleSavePrivacy}
                                    disabled={loading}
                                    className="w-full mt-6"
                                >
                                    {loading ? "Saving..." : "Save Privacy Settings"}
                                </Button>
                            </div>
                        )}

                        {/* Security Section */}
                        {activeSection === "security" && (
                            <div className="max-w-xl">
                                <h2 className="text-xl font-semibold text-white mb-6">Security</h2>
                                <p className="text-slate-400">Password and security features coming soon...</p>
                            </div>
                        )}

                        {/* Help Section */}
                        {activeSection === "help" && (
                            <div className="max-w-xl">
                                <h2 className="text-xl font-semibold text-white mb-6">Help</h2>
                                <p className="text-slate-400">Support and FAQ section coming soon...</p>
                            </div>
                        )}

                        {/* About Section */}
                        {activeSection === "about" && (
                            <div className="max-w-xl">
                                <h2 className="text-xl font-semibold text-white mb-6">About</h2>
                                <div className="space-y-4 text-slate-300">
                                    <p><strong>SkillForge</strong></p>
                                    <p className="text-sm text-slate-400">Version 1.0.0</p>
                                    <p className="text-sm text-slate-400">© 2024 SkillForge. All rights reserved.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper component for toggle settings
function SettingItem({
    icon: Icon,
    title,
    description,
    toggle,
    onToggle
}: {
    icon: any;
    title: string;
    description: string;
    toggle: boolean;
    onToggle: () => void;
}) {
    return (
        <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
            <div className="flex items-start gap-3 flex-1">
                <Icon className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                    <p className="font-medium text-white text-sm">{title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{description}</p>
                </div>
            </div>
            <button
                onClick={onToggle}
                className={`relative w-11 h-6 rounded-full transition-colors ${toggle ? "bg-accent-indigo" : "bg-slate-700"
                    }`}
            >
                <div
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${toggle ? "translate-x-5" : ""
                        }`}
                />
            </button>
        </div>
    );
}

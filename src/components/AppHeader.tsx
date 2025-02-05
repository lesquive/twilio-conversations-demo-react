import { Avatar } from "./Avatar";
import { Text } from "@twilio-paste/core";
import { Menu, MenuButton, useMenuState, MenuItem } from "@twilio-paste/menu";
import { ChevronDownIcon } from "@twilio-paste/icons/esm/ChevronDownIcon";
import React, { useMemo, useState } from "react";
import styles from "../styles";
import { Client, ConnectionState, User } from "@twilio/conversations";
import UserProfileModal from "./modals/UserProfileModal";
import { readUserProfile } from "../api";
import { AppLogo, LOGO_SUB_TITLE, LOGO_TITLE } from "../branding";

type AppHeaderProps = {
  user: string;
  onSignOut: () => void;
  connectionState: ConnectionState;
  client?: Client;
};
const AppHeader: React.FC<AppHeaderProps> = ({
  user,
  onSignOut,
  connectionState,
  client,
}) => {
  const menu = useMenuState();

  const [showUserProfileModal, setUserProfileModal] = useState(false);

  const [userProfile, setUserProfile] = useState<User | undefined>(undefined);

  const handleUserProfileModalClose = () => setUserProfileModal(false);

  const label: "online" | "connecting" | "offline" = useMemo(() => {
    switch (connectionState) {
      case "connected":
        return "online";
      case "connecting":
        return "connecting";
      default:
        return "offline";
    }
  }, [connectionState]);

  const handleUserProfileModalOpen = async () => {
    const userProfileTemp = await readUserProfile(user, client);
    setUserProfile(userProfileTemp);
    setUserProfileModal(true);
  };

  return (
    <div style={styles.appHeader}>
      <div style={styles.flex}>
        <div style={styles.appLogoWrapper}>
          <AppLogo />
        </div>
        <div style={styles.appLogoTitle}>
          {LOGO_TITLE}
          <div style={styles.appLogoSubTitle}>{LOGO_SUB_TITLE}</div>
        </div>
      </div>
      <div style={styles.userTile}>
        <Avatar name={user} />
        <div
          style={{
            padding: "0 10px",
          }}
        >
          <Text as="span" style={styles.userName}>
            {user}
          </Text>
          <Text
            as="span"
            color={
              label === "online"
                ? "colorTextPrimaryWeak"
                : label === "connecting"
                ? "colorTextIconBusy"
                : "colorTextWeaker"
            }
            style={styles.userStatus}
          >
            {label === "online"
              ? "Online"
              : label === "connecting"
              ? "Connecting…"
              : "Offline"}
          </Text>
        </div>
        <MenuButton {...menu} variant="link" size="reset">
          <ChevronDownIcon
            color="colorTextInverse"
            decorative={false}
            title="Settings"
          />
        </MenuButton>
        <Menu {...menu} aria-label="Preferences">
          <MenuItem {...menu} onClick={onSignOut}>
            Sign Out
          </MenuItem>
          <MenuItem {...menu} onClick={handleUserProfileModalOpen}>
            User Profile
          </MenuItem>
        </Menu>
      </div>
      {showUserProfileModal && (
        <UserProfileModal
          isModalOpen={showUserProfileModal}
          handleClose={handleUserProfileModalClose}
          user={userProfile}
        ></UserProfileModal>
      )}
    </div>
  );
};

export default AppHeader;

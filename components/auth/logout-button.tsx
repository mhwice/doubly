"use client";

interface LogoutButtonProps {
  children?: React.ReactNode
};

export const LogoutButton = ({ children }: LogoutButtonProps) => {
  const onClick = () => {
    // signOut();
    // console.log("sign out clicked")
  }

  return (
    <span onClick={onClick} className="cursor-pointer">{children}</span>
  );
}

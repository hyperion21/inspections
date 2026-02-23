import { useEffect, useState, type SyntheticEvent } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { baseFetch } from "../../api/baseFetch";
import CommonToast from "../../components/commonToast/CommonToast";
import TopNavbar from "../../components/topNavbar/TopNavbar";
import { useAuth } from "../../context/AuthContext";

const ProfilePage = () => {
  const { user, token, updateUser } = useAuth();
  const [firstName, setFirstName] = useState<string>(user?.firstName || "");
  const [lastName, setLastName] = useState<string>(user?.lastName || "");
  const [loading, setLoading] = useState<boolean>(false);

  // Toast state
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastVariant, setToastVariant] = useState<"success" | "danger">(
    "success",
  );
  const [showToast, setShowToast] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
    }
  }, [user]);

  const handleSave = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (!token) return;

    setLoading(true);

    try {
      const updatedUser = await baseFetch(
        "/users/me",
        {
          method: "PATCH",
          body: JSON.stringify({ firstName, lastName }),
        },
        token,
      );

      if (updateUser) updateUser(updatedUser);

      setToastVariant("success");
      setToastMessage("Profile updated successfully");
      setShowToast(true);
    } catch (err) {
      console.error(err);
      setToastVariant("danger");
      setToastMessage("Error updating profile");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <>
      <TopNavbar />
      <Container className="p-4 d-flex flex-column min-vh-100">
        <h3>Edit Profile</h3>
        <hr className="mb-4" />
        <Form onSubmit={handleSave}>
          <Form.Group className="mb-3">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </Form.Group>

          <div className="d-flex mt-3">
            <Button
              type="submit"
              className="ms-auto default-button"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </Form>
      </Container>

      <CommonToast
        show={showToast}
        message={toastMessage}
        variant={toastVariant}
        onClose={() => setShowToast(false)}
      />
    </>
  );
};

export default ProfilePage;

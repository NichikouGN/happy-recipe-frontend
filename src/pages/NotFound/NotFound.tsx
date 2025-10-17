import Button from "../../components/Button/Button";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div>
      Uh Oh. It seems like this link is not on the menu. <br />
      How about we order something else?
      <Button
        size="small"
        variant="secondary"
        onClick={() => {
          navigate("/");
        }}
      >
        Home
      </Button>
    </div>
  );
};

export default NotFound;

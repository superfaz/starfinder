import dynamic from "next/dynamic";
import Alert from "react-bootstrap/Alert";
import Stack from "react-bootstrap/Stack";
import { UpdateState } from "./actions";
import ClassDetailsLoading from "./ClassDetailsLoading";

const LazyClassDetailsGeneric = dynamic(() => import("./ClassDetailsGeneric"), {
  loading: () => <ClassDetailsLoading />,
});
const LazyClassDetailsSolarian = dynamic(() => import("./ClassDetailsSolarian"), {
  loading: () => <ClassDetailsLoading />,
});

function LazyClassDetails({ state }: Readonly<{ state: UpdateState }>) {
  switch (state.class?.id) {
    case "envoy":
    case "operative":
    case "mechanic":
    case "mystic":
    case "soldier":
    case "technomancer":
      return <LazyClassDetailsGeneric features={state.features} />;

    case "solarian":
      return <LazyClassDetailsSolarian features={state.features} />;

    default:
      return (
        <Alert variant="info" className="d-flex align-items-center">
          <i className="bi bi-info-circle-fill flex-shrink-0 me-3"></i>
          <div>
            <i>Sélectionnez une classe pour afficher ses abilités.</i>
          </div>
        </Alert>
      );
  }
}

export function ClassDetails({ state }: Readonly<{ state: UpdateState }>) {
  return (
    <Stack direction="vertical" gap={2} className="mb-3">
      <h2>Abilités de classe</h2>
      <LazyClassDetails state={state} />
    </Stack>
  );
}

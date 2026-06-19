import fiftyone.operators as foo
import fiftyone.operators.types as types

class RunAnalyticsEngine(foo.Operator):
    @property
    def config(self):
        return foo.OperatorConfig(
            name="run_analytics_engine",
            label="MetroTwin: Refrescar Análisis de Ocupación",
            description="Recalcula las alertas y el crowd level de la vista actual.",
            dynamic=True
        )

    def resolve_input(self, ctx):
        inputs = types.Object()
        inputs.str("msg", label="Atención", default="Esto recalculará el nivel de ocupación.", view=types.Notice())
        return types.Property(inputs)

    def execute(self, ctx):
        dataset = ctx.dataset
        samples = ctx.view if ctx.view is not None else dataset
        count_updated = 0
        for sample in samples:
            count = sample.get("people_count", 0)
            if count < 10: crowd = "low"
            elif count < 30: crowd = "medium"
            elif count < 50: crowd = "high"
            else: crowd = "critical"
            sample["crowd_level"] = crowd
            sample.tags = [t for t in sample.tags if not t.startswith("crowd_")]
            sample.tags.append(f"crowd_{crowd}")
            sample.save()
            count_updated += 1
        return {"status": "success", "message": f"{count_updated} imágenes recalculadas."}

def register(p):
    p.register(RunAnalyticsEngine)

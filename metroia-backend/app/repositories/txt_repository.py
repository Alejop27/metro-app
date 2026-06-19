import os
import json

DATA_DIR = os.path.join(os.path.dirname(__file__), "../data")


class TxtRepository:
    """Lee y escribe datos desde archivos .txt (JSON lines)."""

    def __init__(self, collection: str):
        self.file_path = os.path.join(DATA_DIR, f"{collection}.txt")
        os.makedirs(DATA_DIR, exist_ok=True)
        if not os.path.exists(self.file_path):
            open(self.file_path, "w").close()

    def find_all(self) -> list[dict]:
        records = []
        with open(self.file_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line:
                    try:
                        records.append(json.loads(line))
                    except json.JSONDecodeError:
                        pass
        return records

    def find_by_id(self, record_id: str) -> dict | None:
        for record in self.find_all():
            if str(record.get("id")) == str(record_id):
                return record
        return None

    def save(self, record: dict) -> dict:
        records = self.find_all()
        records.append(record)
        self._write_all(records)
        return record

    def update(self, record_id: str, data: dict) -> dict | None:
        records = self.find_all()
        for i, r in enumerate(records):
            if str(r.get("id")) == str(record_id):
                records[i] = {**r, **data}
                self._write_all(records)
                return records[i]
        return None

    def delete(self, record_id: str) -> bool:
        records = self.find_all()
        filtered = [r for r in records if str(r.get("id")) != str(record_id)]
        if len(filtered) == len(records):
            return False
        self._write_all(filtered)
        return True

    def _write_all(self, records: list[dict]) -> None:
        with open(self.file_path, "w", encoding="utf-8") as f:
            for record in records:
                f.write(json.dumps(record, ensure_ascii=False) + "\n")

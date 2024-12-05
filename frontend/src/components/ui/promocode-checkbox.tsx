import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

interface PromocodeCheckboxProps {
  isActive: boolean
  onChange: (checked: boolean) => void
}

export function PromocodeCheckbox({
  isActive,
  onChange,
}: PromocodeCheckboxProps) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id="is_active"
        checked={isActive}
        onCheckedChange={(checked) => onChange(checked as boolean)}
      />
      <Label
        htmlFor="is_active"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Is Active
      </Label>
    </div>
  )
}

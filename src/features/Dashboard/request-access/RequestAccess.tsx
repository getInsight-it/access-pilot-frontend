import { Breadcrumbs } from '../../../components/breadcrumbs';
import { RequestAccessForm } from '../../../components/forms/request-access-form';
import { StepForm } from '../../../components/forms/step-form';
import { StepFormHor } from '../../../components/forms/step-form-hor';
import { StepFormVert } from '../../../components/forms/step-form-vert';
import { StepForm3 } from '../../../components/forms/step-form3';
import { StepForm4 } from '../../../components/forms/step-form4';
import Stepper from '../../../components/stepper/Stepper';
import { ScrollArea } from '../../../components/ui/scroll-area';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Solicitar acesso', link: '/dashboard/request-access/create' }
];
export default function RequestAccess() {
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <Breadcrumbs items={breadcrumbItems} />
        {/* <RequestAccessForm /> */}
        {/* <StepFormVert /> */}
        {/* <StepForm /> */}
        {/* <StepFormHor /> */}
        {/* <StepForm3 /> */}
        <StepForm4 />
        {/* <Stepper /> */}
      </div>
    </ScrollArea>
  );
}

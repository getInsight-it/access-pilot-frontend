import { Breadcrumbs } from '../../../components/breadcrumbs';
import { ScrollArea } from '../../../components/ui/scroll-area';
import { RequestDetail } from '../../../components/request-detail/RequestDetail';
import { Heading } from '../../../components/ui/heading';
import { Separator } from '../../../components/ui/separator';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Minhas solicitações', link: '/dashboard/access-requests' },
  { title: 'Detalhe da solicitação', link: '/dashboard/request-access' }
];
export default function RequestDetailPage() {
  const location = useLocation();
  const { origin } = location.state || {};
  return (
    <motion.div
      initial={{
        opacity: 0
      }}
      animate={{
        opacity: 1,
        transition: { duration: 0.3, delay: 0.3, ease: "easeOut" }
      }}
      className="flex-1 space-y-4 p-4 pt-6 md:p-8"
    >

      <Breadcrumbs items={breadcrumbItems} />

      <div className="flex items-start justify-between">
        <Heading
          title={`Detalhe da solicitação`}
          description="Gerenciar solicitações de acesso."
        />
      </div>

      <Separator className="" />

      <RequestDetail origin={origin} />

    </motion.div>
  );
}

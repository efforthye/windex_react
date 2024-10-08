import { useAppSelector } from '@/hooks/reduxHook';
import styled from 'styled-components';

const ModalDescription = ({ description }: { description: string }) => {
    const modal = useAppSelector((state) => state.modal);

    return <ModalDescriptionBox className="fg-middlegrey">{description}</ModalDescriptionBox>;
};

export default ModalDescription;

const ModalDescriptionBox = styled.div`
    width: 100%;
    background-color: transparent;
    text-align: left;
    font-size: 14px;
    line-height: 20.27px;
`;

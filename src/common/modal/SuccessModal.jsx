import WithModal from './WithModal';

const SuccessModal = props => (props.children);

SuccessModal.defaultProps = {
    children: null
};

SuccessModal.propTypes = {
};

export default WithModal(SuccessModal);

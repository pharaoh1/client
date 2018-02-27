package libkb

import (
	sha512 "crypto/sha512"
	json "encoding/json"
	keybase1 "github.com/keybase/client/go/protocol/keybase1"
	jsonw "github.com/keybase/go-jsonw"
	context "golang.org/x/net/context"
)

type resetLinkAndHash struct {
	link keybase1.ResetLink
	hash keybase1.SHA512
}

type unverifiedResetChain []resetLinkAndHash

func importResetLinkAndHash(s string) (ret *resetLinkAndHash, err error) {
	b := []byte(s)
	hash := sha512.Sum512(b)
	var link keybase1.ResetLink
	err = json.Unmarshal(b, &link)
	if err != nil {
		return nil, err
	}
	ret = &resetLinkAndHash{
		hash: hash[:],
		link: link,
	}
	return ret, nil
}

func importResetChainFromServer(ctx context.Context, g *GlobalContext, jw *jsonw.Wrapper) (urc unverifiedResetChain, err error) {
	defer g.CVTrace(ctx, VLog0, "importResetChainFromJSON", func() error { return err })()
	if jw == nil || jw.IsNil() {
		return nil, nil
	}
	var ret unverifiedResetChain
	chainLen, err := jw.Len()
	if err != nil {
		return nil, err
	}
	for i := 0; i < chainLen; i++ {
		s, err := jw.AtIndex(i).GetString()
		if err != nil {
			return nil, err
		}
		link, err := importResetLinkAndHash(s)
		if err != nil {
			return nil, err
		}
		ret = append(ret, *link)
	}
	return ret, nil
}
